import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, defineComponent } from 'vue'
import { VForm } from 'vuetify/components'
import FuInput from '@/components/Form/FuInput.vue'
import { globalOptions, bodyText, squash } from '../support.js'

vi.mock('axios')
// Quill (éditeur riche) ne fonctionne pas dans jsdom : on le remplace par un champ simple
vi.mock('vue3-editor', () => ({
  VueEditor: {
    name: 'VueEditor',
    props: ['modelValue'],
    emits: ['update:modelValue'],
    template: '<textarea class="vue-editor" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)"></textarea>',
  },
}))

const stubs = { FuMembersInput: { props: ['model'], template: '<div class="members-stub">membres de {{ model }}</div>' } }

function mountInput(props) {
  return mount(FuInput, {
    attachTo: document.body,
    props,
    global: globalOptions(undefined, { stubs }),
  })
}

// Monte le champ dans un v-form pour déclencher la validation comme FuForm
async function validateIn(props) {
  const Host = defineComponent({
    render() { return h(VForm, { ref: 'form' }, () => h(FuInput, props)) },
  })
  const wrapper = mount(Host, { attachTo: document.body, global: globalOptions(undefined, { stubs }) })
  const result = await wrapper.vm.$refs.form.validate()
  await wrapper.vm.$nextTick()
  return { wrapper, result }
}

const lastEmitted = (wrapper) => {
  const events = wrapper.emitted('update:modelValue') || []
  return events.length ? events[events.length - 1][0] : undefined
}

describe('FuInput : champ générique piloté par la config serveur', () => {
  beforeEach(() => vi.clearAllMocks())
  afterEach(() => { document.body.innerHTML = '' })

  it('texte : affiche le libellé et la valeur, et remonte la saisie', async () => {
    const wrapper = mountInput({ type: 'text', label: 'Nom *', value: 'Région Sud' })
    expect(wrapper.find('label').text()).toBe('Nom *')
    const input = wrapper.find('input')
    expect(input.element.value).toBe('Région Sud')
    await input.setValue('Région Sud-Est')
    expect(lastEmitted(wrapper)).toBe('Région Sud-Est')
  })

  it('suit la valeur reçue du parent (fiche chargée après l’ouverture)', async () => {
    const wrapper = mountInput({ type: 'text', label: 'Ville', value: '' })
    await wrapper.setProps({ value: 'Lyon' })
    expect(wrapper.find('input').element.value).toBe('Lyon')
    expect(lastEmitted(wrapper)).toBe('Lyon')
  })

  it('règle « required » : un champ vide est refusé avec un message', async () => {
    const { result } = await validateIn({ type: 'text', label: 'Nom', rules: ['required'], value: '' })
    expect(result.valid).toBe(false)
    expect(bodyText()).toContain('Ce champ est requis')
  })

  it('règle « email » : accepte un champ vide, refuse une adresse mal formée', async () => {
    let { result } = await validateIn({ type: 'text', label: 'Email', rules: ['email'], value: '' })
    expect(result.valid).toBe(true)
    document.body.innerHTML = ''
    ;({ result } = await validateIn({ type: 'text', label: 'Email', rules: ['email'], value: 'pasteur@add' }))
    expect(result.valid).toBe(false)
    expect(bodyText()).toContain('Veuillez entrer une adresse e-mail valide')
    document.body.innerHTML = ''
    ;({ result } = await validateIn({ type: 'text', label: 'Email', rules: ['email'], value: 'pasteur@addfrance.fr' }))
    expect(result.valid).toBe(true)
  })

  it('règles de longueur : minLength (3) et maxLength (255) ; une règle inconnue est ignorée', async () => {
    let { result } = await validateIn({ type: 'text', rules: ['minLength', 'inconnue'], value: 'ab' })
    expect(result.valid).toBe(false)
    expect(bodyText()).toContain('Saisissez au moins 3 caractères')
    document.body.innerHTML = ''
    ;({ result } = await validateIn({ type: 'text', rules: ['maxLength'], value: 'x'.repeat(256) }))
    expect(result.valid).toBe(false)
    expect(bodyText()).toContain('Saisissez au plus 255 caractères')
    document.body.innerHTML = ''
    ;({ result } = await validateIn({ type: 'text', rules: ['minLength', 'maxLength'], value: 'Lyon' }))
    expect(result.valid).toBe(true)
  })

  it('case à cocher (bool) : remonte true/false', async () => {
    const wrapper = mountInput({ type: 'bool', label: 'Épingler', value: false })
    expect(squash(wrapper.text())).toContain('Épingler')
    await wrapper.find('input[type="checkbox"]').setValue(true)
    expect(lastEmitted(wrapper)).toBe(true)
  })

  it('date, nombre décimal et date-heure utilisent les champs natifs adaptés', async () => {
    let wrapper = mountInput({ type: 'date', label: 'Payée le', value: '2026-03-01' })
    expect(wrapper.find('input').attributes('type')).toBe('date')
    expect(wrapper.find('input').element.value).toBe('2026-03-01')

    wrapper = mountInput({ type: 'float', label: 'Montant', value: 12.5 })
    const input = wrapper.find('input')
    expect(input.attributes('type')).toBe('number')
    expect(input.attributes('step')).toBe('any')
    expect(input.attributes('inputmode')).toBe('decimal')
    await input.setValue('30.25')
    expect(lastEmitted(wrapper)).toBe('30.25')

    wrapper = mountInput({ type: 'datetime', label: 'Publié le', value: '2026-05-10T08:30:00' })
    expect(wrapper.find('input').attributes('type')).toBe('datetime-local')
  })

  it('date-heure : convertit une date ISO au format attendu par le champ local', () => {
    const wrapper = mountInput({ type: 'datetime', value: null })
    expect(wrapper.vm.getIsoDate(null)).toBeNull()
    expect(wrapper.vm.getIsoDate('')).toBeNull()
    const local = new Date(2026, 4, 10, 8, 30) // 10 mai 2026 08:30 heure locale
    expect(wrapper.vm.getIsoDate(local.toISOString())).toBe('2026-05-10T08:30')
  })

  it('liste à choix unique (select_one) : remonte la valeur de l’option choisie, pas l’objet', async () => {
    const items = [{ value: 2026, title: '2026' }, { value: 2025, title: '2025' }]
    const wrapper = mountInput({ type: 'select_one', label: 'Année', items, value: null })
    wrapper.vm.localValue = items[1]
    await wrapper.vm.$nextTick()
    expect(lastEmitted(wrapper)).toBe(2025)
    wrapper.vm.localValue = 'saisie libre'
    await wrapper.vm.$nextTick()
    expect(lastEmitted(wrapper)).toBe('saisie libre')
  })

  it('autocomplétion (autocomplete_one) : propose les éléments de la config', async () => {
    const items = [{ value: 'User-1', title: 'DUPONT Jean' }, { value: 'User-2', title: 'MARTIN Paul' }]
    const wrapper = mountInput({ type: 'autocomplete_one', label: 'Membre', items, value: 'User-2' })
    expect(wrapper.find('.v-autocomplete').exists()).toBe(true)
    expect(squash(wrapper.text())).toContain('MARTIN Paul')
  })

  it('choix multiple (select_multiple) : passe par SelectAll avec les éléments de la config', () => {
    const items = [{ value: 'pasteur', title: 'Pasteur' }, { value: 'membre', title: 'Membre' }]
    const wrapper = mountInput({ type: 'select_multiple', label: 'Accessible par :', items, value: ['pasteur'] })
    const select = wrapper.findComponent({ name: 'SelectAll' })
    expect(select.exists()).toBe(true)
    expect(select.props('items')).toEqual(items)
    expect(select.props('modelValue')).toEqual(['pasteur'])
  })

  it('éditeur riche (wysiwyg) : remonte le HTML saisi', async () => {
    const wrapper = mountInput({ type: 'wysiwyg', value: '<p>Bonjour</p>' })
    const editor = wrapper.find('textarea.vue-editor')
    expect(editor.element.value).toBe('<p>Bonjour</p>')
    await editor.setValue('<p>Bonsoir</p>')
    expect(lastEmitted(wrapper)).toBe('<p>Bonsoir</p>')
  })

  it('fichiers (files / list_files) et membres délèguent aux composants dédiés', () => {
    let wrapper = mountInput({ type: 'files', label: 'Nouveaux fichiers', value: [] })
    expect(wrapper.findComponent({ name: 'FuFileUpload' }).exists()).toBe(true)
    wrapper = mountInput({ type: 'list_files', value: [{ id: 1, name: 'a.pdf', url: '/a.pdf' }] })
    expect(wrapper.findComponent({ name: 'FuExistingFilesList' }).props('modelValue')).toEqual([{ id: 1, name: 'a.pdf', url: '/a.pdf' }])
    wrapper = mountInput({ type: 'members', model: 'regions' })
    expect(wrapper.find('.members-stub').text()).toBe('membres de regions')
  })

  it('type inconnu : affiche un message explicite', () => {
    const wrapper = mountInput({ type: 'couleur' })
    expect(squash(wrapper.text())).toContain('Type de champ inconnu')
    expect(squash(wrapper.text())).toContain('couleur')
  })

  it('fichier unique (file) : refuse zéro ou plusieurs fichiers, remonte le fichier choisi', async () => {
    const wrapper = mountInput({ type: 'file', label: 'Logo', value: null })
    expect(wrapper.find('input[type="file"]').exists()).toBe(true)
    wrapper.vm.$root.showSnackbar = vi.fn()
    const a = new File(['a'], 'a.png')
    const b = new File(['b'], 'b.png')

    wrapper.vm.prepareInput([])
    expect(wrapper.vm.$root.showSnackbar).toHaveBeenLastCalledWith('Aucun fichier sélectionné', 'warning')
    wrapper.vm.prepareInput([a, b])
    expect(wrapper.vm.$root.showSnackbar).toHaveBeenLastCalledWith('Vous devez sélectionner un seul fichier', 'warning')
    wrapper.vm.prepareInput([a])
    expect(lastEmitted(wrapper)).toBe(a)
  })

  it('fichier unique : le changement du champ natif déclenche le contrôle', async () => {
    const wrapper = mountInput({ type: 'file', label: 'Logo', value: null })
    wrapper.vm.$root.showSnackbar = vi.fn()
    const input = wrapper.find('input[type="file"]')
    Object.defineProperty(input.element, 'files', { value: [], configurable: true })
    await input.trigger('change')
    expect(wrapper.vm.$root.showSnackbar).toHaveBeenCalledWith('Aucun fichier sélectionné', 'warning')
  })
})
