import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import FuFileUpload from '@/components/Form/FuFileUpload.vue'
import FuExistingFilesList from '@/components/Form/FuExistingFilesList.vue'
import SelectAll from '@/components/Form/SelectAll.vue'
import { flush } from '../../helpers.js'
import { globalOptions, squash, bodyText } from '../support.js'

const opts = () => ({ attachTo: document.body, global: globalOptions() })
const last = (wrapper) => wrapper.emitted('update:modelValue').at(-1)[0]

describe('FuFileUpload : ajout de fichiers', () => {
  afterEach(() => { document.body.innerHTML = '' })

  it('champ multiple, remonte les fichiers choisis', async () => {
    const wrapper = mount(FuFileUpload, { ...opts(), props: { modelValue: [] } })
    const input = wrapper.find('input[type="file"]')
    expect(input.attributes('multiple')).toBeDefined()
    expect(squash(wrapper.text())).toContain('Rechercher des fichiers')
    const files = [new File(['a'], 'a.pdf'), new File(['b'], 'b.pdf')]
    Object.defineProperty(input.element, 'files', { value: files, configurable: true })
    await input.trigger('change')
    expect(last(wrapper)).toEqual(files)
  })
})

describe('FuExistingFilesList : fichiers déjà joints', () => {
  afterEach(() => { document.body.innerHTML = '' })
  const files = () => [
    { id: 1, name: 'Statuts.pdf', url: '/files/1' },
    { id: 2, name: 'PV AG.pdf', url: '/files/2' },
  ]

  it('liste les fichiers avec un lien d’ouverture dans un nouvel onglet', () => {
    const wrapper = mount(FuExistingFilesList, { ...opts(), props: { modelValue: files() } })
    const links = wrapper.findAll('a')
    expect(links.map(a => [a.text(), a.attributes('href'), a.attributes('target')]))
      .toEqual([['Statuts.pdf', '/files/1', '_blank'], ['PV AG.pdf', '/files/2', '_blank']])
  })

  it('retirer un fichier le fait disparaître et remonte la liste restante au formulaire', async () => {
    const wrapper = mount(FuExistingFilesList, { ...opts(), props: { modelValue: files() } })
    await wrapper.findAll('button')[0].trigger('click')
    await flush()
    expect(wrapper.findAll('a').map(a => a.text())).toEqual(['PV AG.pdf'])
    // Sans cela, le fichier retiré reste dans existing_attachments et n'est jamais supprimé côté serveur
    expect(last(wrapper)).toEqual([{ id: 2, name: 'PV AG.pdf', url: '/files/2' }])
  })

  it('suit la liste du parent quand elle change (fiche chargée)', async () => {
    const wrapper = mount(FuExistingFilesList, { ...opts(), props: { modelValue: [] } })
    await wrapper.setProps({ modelValue: files() })
    expect(wrapper.findAll('a')).toHaveLength(2)
    // même contenu : pas de recopie
    const before = wrapper.vm.localModelValue
    await wrapper.setProps({ modelValue: files() })
    expect(wrapper.vm.localModelValue).toBe(before)
  })
})

describe('SelectAll (formulaire) : liste à choix multiple avec « Tout sélectionner »', () => {
  afterEach(() => { document.body.innerHTML = '' })
  const items = ['Pasteur APE', 'Pasteur stagiaire', 'Membre']

  it('cocher « Tout sélectionner » choisit toutes les options, le décocher les retire', async () => {
    // Le menu déroulant de v-select est rendu en ligne : son positionnement dans jsdom est extrêmement lent
    const stubs = { VMenu: { template: '<div class="menu-stub"><slot /></div>' } }
    const wrapper = mount(SelectAll, { attachTo: document.body, props: { items, modelValue: [], label: 'Accès', multiple: true, chips: true }, global: globalOptions(undefined, { stubs }) })
    await flush()
    const checkbox = wrapper.find('.menu-stub .v-checkbox')
    expect(squash(checkbox.text())).toBe('Tout selectionner')
    await checkbox.find('input').setValue(true)
    await flush()
    expect(last(wrapper)).toEqual(items)
    expect(wrapper.vm.selectAll).toBe(true)
    await wrapper.find('.menu-stub .v-checkbox input').setValue(false)
    await flush()
    expect(last(wrapper)).toEqual([])
  })

  it('suit la valeur du parent et transmet les attributs à la liste', async () => {
    const wrapper = mount(SelectAll, { ...opts(), props: { items, modelValue: ['Membre'], label: 'Accès', multiple: true, chips: true } })
    expect(squash(wrapper.text())).toContain('Accès')
    expect(squash(wrapper.text())).toContain('Membre')
    await wrapper.setProps({ modelValue: items })
    expect(wrapper.vm.selectAll).toBe(true)
    // même longueur : pas de recopie
    await wrapper.setProps({ modelValue: ['a', 'b', 'c'] })
    expect(wrapper.vm.localModelValue).toEqual(items)
  })
})
