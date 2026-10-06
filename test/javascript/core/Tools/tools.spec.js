import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import DialogConfirm from '@/components/Tools/DialogConfirm.vue'
import Download from '@/components/Tools/Download.vue'
import RowAction from '@/components/Tools/RowAction.vue'
import SelectAll from '@/components/Tools/SelectAll.vue'
import { flush } from '../../helpers.js'
import { globalOptions, squash, bodyText } from '../support.js'

const opts = (props, extra = {}) => ({ attachTo: document.body, props, global: globalOptions(), ...extra })
// Blob.text() n'existe pas dans jsdom
const readBlob = (blob) => new Promise(resolve => {
  const reader = new FileReader()
  reader.onload = () => resolve(reader.result)
  reader.readAsText(blob)
})
// Le menu déroulant de v-select est rendu en ligne : son positionnement dans jsdom est extrêmement lent
const menuStub = { VMenu: { template: '<div class="menu-stub"><slot /></div>' } }
const button = (wrapper, label) => wrapper.findAll('button').find(b => squash(b.text()) === label)

afterEach(() => {
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

describe('DialogConfirm : demande de confirmation', () => {
  it('textes par défaut : « Etes-vous sûr ? », Oui / Non, sans titre', async () => {
    const wrapper = mount(DialogConfirm, opts({}))
    expect(wrapper.find('.v-card-text').text()).toBe('Etes-vous sûr ?')
    expect(wrapper.findAll('button').map(b => squash(b.text()))).toEqual(['Non', 'Oui'])
    expect(wrapper.find('.v-card-title').exists()).toBe(false)
    await button(wrapper, 'Oui').trigger('click')
    await button(wrapper, 'Non').trigger('click')
    expect(wrapper.emitted('confirm')).toHaveLength(1)
    expect(wrapper.emitted('cancel')).toHaveLength(1)
  })

  it('titre, contenu et libellés personnalisés, ou contenu fourni par slot', () => {
    let wrapper = mount(DialogConfirm, opts({ title: 'Clore la campagne', content: 'Les votes seront figés.', textConfirm: 'Clore', textCancel: 'Annuler' }))
    expect(wrapper.find('.v-card-title').text()).toBe('Clore la campagne')
    expect(wrapper.find('.v-card-text').text()).toBe('Les votes seront figés.')
    expect(wrapper.findAll('button').map(b => squash(b.text()))).toEqual(['Annuler', 'Clore'])
    wrapper = mount(DialogConfirm, opts({ title: 'X' }, { slots: { title: '<em>Titre riche</em>', content: '<strong>Attention</strong>' } }))
    expect(wrapper.find('em').text()).toBe('Titre riche')
    expect(wrapper.find('strong').text()).toBe('Attention')
  })
})

describe('Download : export CSV d’une liste', () => {
  const headers = [{ title: 'Nom', field: 'name' }, { title: 'Ville', field: 'town' }]
  const data = [{ name: 'Église de Lyon', town: 'Lyon' }, { name: 'Église de Lille', town: 'Lille' }]

  it('construit un CSV séparé par des points-virgules, en-têtes compris', () => {
    const wrapper = mount(Download, opts({ data, headers, name: 'eglises' }))
    expect(wrapper.vm.convertToCSV(data)).toBe('Nom;Ville\r\nÉglise de Lyon;Lyon\r\nÉglise de Lille;Lille\r\n')
    expect(wrapper.vm.convertToCSV(JSON.stringify([{ name: 'A', town: 'B' }]))).toBe('Nom;Ville\r\nA;B\r\n')
  })

  it('le bouton télécharge le fichier <name>.csv', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    URL.createObjectURL = vi.fn(() => 'blob:csv')
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function () {
      click.link = { href: this.href, download: this.download }
    })
    const wrapper = mount(Download, opts({ data, headers, name: 'eglises' }))
    expect(squash(wrapper.text())).toBe('Exporter la liste (CSV)')
    await wrapper.find('button').trigger('click')
    expect(URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob))
    const blob = URL.createObjectURL.mock.calls[0][0]
    expect(blob.type).toBe('text/csv')
    expect(await readBlob(blob)).toBe('Nom;Ville\r\nÉglise de Lyon;Lyon\r\nÉglise de Lille;Lille\r\n')
    expect(click.link).toEqual({ href: 'blob:csv', download: 'eglises.csv' })
  })
})

describe('RowAction : bouton-icône de ligne', () => {
  it('nommé pour les lecteurs d’écran, avec infobulle, et émet click', async () => {
    const wrapper = mount(RowAction, opts({ icon: 'mdi-pencil', label: 'Modifier la campagne' }))
    const btn = wrapper.find('button')
    expect(btn.attributes('aria-label')).toBe('Modifier la campagne')
    expect(btn.find('.mdi-pencil').exists()).toBe(true)
    expect(btn.classes()).toContain('text-primary')
    await btn.trigger('mouseenter')
    await flush()
    expect(bodyText()).toContain('Modifier la campagne')
    await btn.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('couleur et état de chargement', () => {
    const wrapper = mount(RowAction, opts({ icon: 'mdi-delete', label: 'Supprimer', color: 'error', loading: true }))
    expect(wrapper.find('button').classes()).toContain('text-error')
    expect(wrapper.find('.v-progress-circular').exists()).toBe(true)
  })
})

describe('SelectAll (outils) : gestion des accès', () => {
  const options = ['Pasteur APE', 'Membre', 'Église']

  it('« Tout sélectionner » coche toutes les options puis les retire', async () => {
    const wrapper = mount(SelectAll, opts({ options, modelValue: [] }))
    await flush()
    expect(squash(wrapper.text())).toContain('Gestion des accès')
    expect(wrapper.vm.selectAll).toBe(false)
    wrapper.vm.toggle()
    await flush()
    expect(wrapper.emitted('update:modelValue').at(-1)[0]).toEqual(options)
    expect(wrapper.vm.selectAll).toBe(true)
    wrapper.vm.toggle()
    await flush()
    expect(wrapper.emitted('update:modelValue').at(-1)[0]).toEqual([])
    expect(wrapper.vm.selectAll).toBe(false)
  })

  it('la case du menu déroulant sélectionne tout', async () => {
    const wrapper = mount(SelectAll, { attachTo: document.body, props: { options, modelValue: [] }, global: globalOptions(undefined, { stubs: menuStub }) })
    await flush()
    const checkbox = wrapper.find('.menu-stub .v-checkbox')
    expect(squash(checkbox.text())).toBe('Tout selectionner')
    await checkbox.find('input').trigger('click')
    await flush()
    expect(wrapper.emitted('update:modelValue').at(-1)[0]).toEqual(options)
  })

  it('une valeur initiale complète coche « Tout sélectionner » ; suit la valeur du parent', async () => {
    const wrapper = mount(SelectAll, opts({ options, modelValue: [...options] }))
    await flush()
    expect(wrapper.vm.selectAll).toBe(true)
    await wrapper.setProps({ modelValue: ['Membre'] })
    expect(wrapper.vm.localModelValue).toEqual(['Membre'])
    expect(wrapper.vm.selectAll).toBe(false)
  })
})
