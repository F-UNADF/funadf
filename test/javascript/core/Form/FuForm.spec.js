import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import axios from 'axios'
import FuForm from '@/components/Form/FuForm.vue'
import { store, flush } from '../../helpers.js'
import { globalOptions, squash, formDataEntries } from '../support.js'

vi.mock('axios')
vi.mock('vue3-editor', () => ({ VueEditor: { name: 'VueEditor', template: '<div />' } }))

const stubs = { FuMembersInput: { props: ['model'], template: '<div class="members-stub">Membres de la structure</div>' } }

// Config telle que la renvoie GET /api/regions/config (UiConfig::StructuresConfig)
const structureConfig = () => ({
  toolbarActions: [{ name: 'add', title: 'regions.add', icon: 'mdi-plus', action: 'add' }],
  itemActions: [
    { name: 'edit', title: 'regions.edit', icon: 'mdi-pencil', action: 'edit' },
    { name: 'delete', title: 'regions.delete', icon: 'mdi-delete', action: 'delete' },
  ],
  form: {
    fullscreen: true,
    defaultItem: { id: null, name: null, zipcode: null, town: null, email: null },
    tabs: [
      { title: 'Information générale', name: 'infos', fields: [
        { name: 'name', type: 'text', label: 'Nom', rules: ['required'] },
        { name: 'zipcode', type: 'text', label: 'Code postal', rules: ['required'], grid: 6 },
        { name: 'town', type: 'text', label: 'Ville', rules: ['required'], grid: 6 },
        { name: 'email', type: 'text', label: 'Email', rules: ['email'] },
        { name: 'website', type: 'text' },
      ] },
      { title: 'Membres', name: 'members', if: ['id', '!=', 'null'], fields: [{ name: 'members', type: 'members', label: 'Membres' }] },
    ],
  },
})

function mountForm(item, config = structureConfig()) {
  const s = store()
  s.commit('regions/setItem', item)
  s.commit('regions/setConfig', config)
  const wrapper = mount(FuForm, {
    attachTo: document.body,
    props: { model: 'regions', config },
    global: globalOptions(s, { stubs }),
  })
  wrapper.vm.$root.showSnackbar = vi.fn()
  return { wrapper, s }
}

const labels = (wrapper) => wrapper.findAll('label.v-label:not(.v-field-label--floating)').map(l => squash(l.text()))
const fill = async (wrapper, label, value) => {
  const field = wrapper.findAll('.v-text-field').find(f => squash(f.find('label').text()) === label)
  await field.find('input').setValue(value)
}

describe('FuForm : formulaire générique décrit par /api/:model/config', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })
  afterEach(() => { document.body.innerHTML = '' })

  it('création : titre « Ajouter », champs de l’onglet visible, astérisques et mention des champs obligatoires', async () => {
    const { wrapper } = mountForm({ id: null, name: null })
    await flush()
    const text = squash(wrapper.text())
    expect(text).toContain('Ajouter une région')
    expect(text).toContain('Les champs marqués d\'un astérisque (*) sont obligatoires.')
    // label absent : libellé i18n « <model>.<champ> »
    expect(labels(wrapper)).toEqual(['Nom *', 'Code postal *', 'Ville *', 'Email', 'Site web'])
    // l'onglet Membres est conditionné à un id : pas d'onglets pour une création
    expect(wrapper.find('.v-tabs').exists()).toBe(false)
    expect(wrapper.find('.members-stub').exists()).toBe(false)
  })

  it('modification : titre « Modifier », champs pré-remplis et onglet Membres', async () => {
    const { wrapper } = mountForm({ id: 3, name: 'Sud-Est', zipcode: '69000', town: 'Lyon' })
    await flush()
    expect(squash(wrapper.text())).toContain('Modifier la région')
    const tabs = wrapper.findAll('.v-tab').map(t => squash(t.text()))
    expect(tabs).toEqual(['Information générale', 'Membres'])
    expect(wrapper.findAll('input').map(i => i.element.value).slice(0, 3)).toEqual(['Sud-Est', '69000', 'Lyon'])
    expect(wrapper.find('.members-stub').exists()).toBe(true) // onglets « eager » : rendu d'avance
  })

  it('n’enregistre pas un formulaire invalide et le signale', async () => {
    const { wrapper } = mountForm({ id: null, name: null })
    await flush()
    await wrapper.find('form').trigger('submit')
    await flush()
    expect(wrapper.vm.$root.showSnackbar).toHaveBeenCalledWith('Certains champs sont à corriger avant d\'enregistrer.', 'error')
    expect(squash(document.body.textContent)).toContain('Ce champ est requis')
    expect(axios.post).not.toHaveBeenCalled()
  })

  it('enregistre la saisie (POST multipart), confirme et recharge la liste', async () => {
    const { wrapper, s } = mountForm({ id: null, name: null, zipcode: null, town: null, email: null })
    await flush()
    await fill(wrapper, 'Nom *', 'Nord')
    await fill(wrapper, 'Code postal *', '59000')
    await fill(wrapper, 'Ville *', 'Lille')
    s.commit('regions/setDialog', true)
    axios.post.mockResolvedValue({ data: { status: 200, region: { id: 9, name: 'Nord' } } })
    axios.get.mockResolvedValue({ data: { regions: [{ id: 9, name: 'Nord' }] } })

    await wrapper.find('form').trigger('submit')
    await flush()
    await flush()
    const [url, fd] = axios.post.mock.calls[0]
    expect(url).toBe('/api/regions')
    expect(formDataEntries(fd)).toEqual(expect.arrayContaining([
      ['region[name]', 'Nord'], ['region[zipcode]', '59000'], ['region[town]', 'Lille'], ['region[email]', ''],
    ]))
    expect(wrapper.vm.$root.showSnackbar).toHaveBeenCalledWith('Région enregistrée', 'success')
    expect(s.getters['regions/getDialog']).toBe(false)
    expect(s.getters['regions/getItems']).toEqual([{ id: 9, name: 'Nord' }])
    expect(wrapper.vm.saving).toBe(false)
  })

  it('erreur de validation serveur (status 422) : message d’erreur et formulaire laissé ouvert', async () => {
    const { wrapper, s } = mountForm({ id: 3, name: 'Sud', zipcode: '13000', town: 'Marseille' })
    s.commit('regions/setDialog', true)
    await flush()
    axios.patch.mockResolvedValue({ data: { status: 422, errors: { name: ['est déjà utilisé'] } } })
    await wrapper.find('form').trigger('submit')
    await flush()
    await flush()
    expect(axios.patch.mock.calls[0][0]).toBe('/api/regions/3')
    expect(wrapper.vm.$root.showSnackbar).toHaveBeenCalledWith('Erreur lors de l\'enregistrement', 'error')
    expect(wrapper.vm.$root.showSnackbar).not.toHaveBeenCalledWith('Région enregistrée', 'success')
    expect(s.getters['regions/getDialog']).toBe(true)
  })

  it('erreur avec une liste de messages : les affiche tous', async () => {
    const { wrapper } = mountForm({ id: 3, name: 'Sud', zipcode: '13000', town: 'Marseille' })
    await flush()
    axios.patch.mockRejectedValue({ response: { data: { errors: ['Nom déjà pris', 'Ville inconnue'] } } })
    await wrapper.vm.save()
    await flush()
    expect(wrapper.vm.$root.showSnackbar).toHaveBeenCalledWith('Nom déjà pris<br/>Ville inconnue', 'error')
  })

  it('ignore un second envoi pendant l’enregistrement', async () => {
    const { wrapper } = mountForm({ id: 3, name: 'Sud', zipcode: '13000', town: 'Marseille' })
    await flush()
    axios.patch.mockReturnValue(new Promise(() => {}))
    wrapper.vm.save()
    await flush()
    expect(wrapper.vm.saving).toBe(true)
    await wrapper.vm.save()
    expect(axios.patch).toHaveBeenCalledTimes(1)
  })

  it('le bouton fermer et le bouton Annuler émettent « close »', async () => {
    const { wrapper } = mountForm({ id: null })
    await wrapper.find('button[aria-label="Fermer"]').trigger('click')
    await wrapper.findAll('button').find(b => squash(b.text()) === 'Annuler').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(2)
  })

  it('formulaire sans onglet (form.fields) et sans champ obligatoire', async () => {
    const config = { form: { fields: [{ name: 'title', type: 'text', label: 'Titre' }, { name: 'amount', type: 'float' }] } }
    const { wrapper } = mountForm({ id: null, title: 'Cotisation' }, config)
    await flush()
    expect(labels(wrapper)).toEqual(['Titre', 'regions.amount'])
    expect(squash(wrapper.text())).not.toContain('obligatoires')
    expect(wrapper.find('input').element.value).toBe('Cotisation')
  })

  it('suit la fiche du store quand elle change (édition après chargement)', async () => {
    const { wrapper, s } = mountForm({ id: null, name: null })
    await flush()
    s.commit('regions/setItem', { id: 4, name: 'Centre' })
    await flush()
    expect(wrapper.vm.editedItem).toEqual({ id: 4, name: 'Centre' })
    expect(wrapper.vm.tab).toBe('infos')
  })

  it('conditions d’affichage des onglets : tous les opérateurs de la config', async () => {
    const { wrapper } = mountForm({ id: 5, count: 3, label: null })
    const ok = (c) => wrapper.vm.manageCondition(c)
    expect(ok(undefined)).toBe(true)
    expect(ok(['id', '==', '5'])).toBe(true)
    expect(ok(['id', '===', '5'])).toBe(false)
    expect(ok(['label', '===', 'null'])).toBe(true)
    expect(ok(['id', '!=', 'null'])).toBe(true)
    expect(ok(['label', '!==', 'null'])).toBe(false)
    expect(ok(['count', '<', 4])).toBe(true)
    expect(ok(['count', '<=', 2])).toBe(false)
    expect(ok(['count', '>', 2])).toBe(true)
    expect(ok(['count', '>=', 4])).toBe(false)
    expect(ok(['count', '~', 4])).toBe(true) // opérateur inconnu : onglet affiché
  })
})
