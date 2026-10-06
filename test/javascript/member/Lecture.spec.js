import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import PostItem from '@/components/Posts/me/Item.vue'
import EventItem from '@/components/Events/me/Item.vue'
import EventDetail from '@/components/Events/me/Detail.vue'
import { mountMember, flush, pageText, buttonByText } from './support.js'

const post = (overrides = {}) => ({
  id: 9, title: 'Retraite des pasteurs', content: '<p>Inscriptions <strong>ouvertes</strong></p>',
  created_at: '2026-09-15T08:05:00', pinned: false, images: [], attachments: [],
  structure: { id: 12, name: 'ADD Région Sud' }, ...overrides,
})

const event = (overrides = {}) => ({
  id: 3, title: 'Congrès national', start_at: '2026-11-02T09:30:00', end_at: '2026-11-04T18:00:00',
  description: '<p>Trois jours de <em>louange</em></p>', structure: { id: 5, name: 'UNADF' },
  category: { id: 2, name: 'Congrès' }, ...overrides,
})

describe('Lecture d’une actu', () => {
  afterEach(() => { document.body.innerHTML = '' })

  it('affiche la structure, la date, le titre et le contenu HTML', () => {
    const { wrapper } = mountMember(PostItem, { props: { post: post() } })
    expect(wrapper.find('h6').text()).toBe('ADD Région Sud')
    expect(pageText()).toContain('15/09/2026 08:05')
    expect(wrapper.find('h3').text()).toBe('Retraite des pasteurs')
    expect(wrapper.find('strong').text()).toBe('ouvertes')
    expect(wrapper.find('.cover').exists()).toBe(false)
    expect(pageText()).not.toContain('Pièce jointe')
    expect(pageText()).not.toContain('Actualité épinglée')
    expect(wrapper.find('img').attributes('src')).toBe('/logos/12.png')
  })

  it('logo introuvable : logo par défaut ; actu sans structure ni date', async () => {
    const { wrapper } = mountMember(PostItem, { props: { post: post({ structure: null, created_at: null, title: null, content: null }) } })
    expect(wrapper.find('h6').text()).toBe('Structure')
    expect(wrapper.find('img').attributes('src')).toBe('/logos/default.png')

    await wrapper.setProps({ post: post() })
    await wrapper.find('img').trigger('error')
    expect(wrapper.find('img').attributes('src')).toBe('/logos/default.png')
  })

  it('images : couverture, grille limitée à 3 avec le nombre d’images en plus, et carrousel', async () => {
    const images = ['/i/1.jpg', '/i/2.jpg', null, '/i/3.jpg', '/i/4.jpg', '/i/5.jpg']
    const { wrapper } = mountMember(PostItem, { props: { post: post({ images, pinned: true }) } })

    expect(wrapper.find('.cover-img').attributes('src')).toBe('/i/1.jpg')
    expect(pageText()).toContain('Actualité épinglée')
    const tiles = wrapper.findAll('.v-row .v-img')
    expect(tiles).toHaveLength(3)
    expect(pageText()).toContain('2+')

    await tiles[1].trigger('click')
    await flush()
    expect(wrapper.vm.carouselDialog).toBe(true)
    expect(wrapper.vm.carouselIndex).toBe(1)
    expect(document.querySelector('.v-carousel')).not.toBeNull()

    document.querySelector('.v-dialog .v-btn').click()
    await flush()
    expect(wrapper.vm.carouselDialog).toBe(false)
    expect(wrapper.vm.imageAlt(0)).toBe('Retraite des pasteurs (1)')
  })

  it('pièces jointes : un lien de téléchargement par fichier', () => {
    const { wrapper } = mountMember(PostItem, { props: { post: post({ attachments: ['/f/a.pdf', '/f/b.pdf'] }) } })
    const links = wrapper.findAll('a.v-btn')
    expect(links.map(l => [l.text(), l.attributes('href'), l.attributes('target')])).toEqual([
      ['Pièce jointe 1', '/f/a.pdf', '_blank'],
      ['Pièce jointe 2', '/f/b.pdf', '_blank'],
    ])
  })
})

describe('Lecture d’un événement', () => {
  beforeEach(() => vi.restoreAllMocks())
  afterEach(() => { document.body.innerHTML = '' })

  it('carte du fil : structure, catégorie, titre et dates ; un clic ouvre le détail, « Fermer » le referme', async () => {
    const { wrapper } = mountMember(EventItem, { props: { event: event() } })
    expect(pageText()).toContain('UNADF')
    expect(pageText()).toContain('Congrès national')
    expect(pageText()).toContain('Du 02/11/2026 09:30 au 04/11/2026 18:00')
    expect(wrapper.attributes('aria-label')).toBe('Congrès national, voir le détail')

    await wrapper.trigger('click')
    await flush()
    expect(pageText()).toContain('Du 02/11/2026 à 09:30 au 04/11/2026 à 18:00')
    expect(pageText()).toContain('Trois jours de louange')

    buttonByText('Fermer').click()
    await flush()
    expect(wrapper.vm.detail).toBe(false)
  })

  it('événement sans catégorie', () => {
    mountMember(EventItem, { props: { event: event({ category: null }) } })
    expect(pageText()).not.toContain('Congrès Congrès')
  })

  it('détail : images cliquables (nouvel onglet) et pièces jointes, sans bouton Fermer hors dialogue', async () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null)
    const { wrapper } = mountMember(EventDetail, {
      props: { event: event({ images: ['/i/affiche.jpg'], attachments: ['/rails/blobs/programme-du-congres-2026.pdf'] }) },
    })
    expect(wrapper.find('.v-card-subtitle').text().replace(/\s+/g, ' ')).toBe('UNADF – Congrès')

    await wrapper.find('.v-img').trigger('click')
    expect(open).toHaveBeenCalledWith('/i/affiche.jpg', '_blank', 'noopener,noreferrer')

    const attachment = wrapper.find('a.v-btn')
    expect(attachment.attributes('href')).toBe('/rails/blobs/programme-du-congres-2026.pdf')
    expect(attachment.text()).toContain('programme-du-co...')
    expect(buttonByText('Fermer')).toBeUndefined()
  })

  it('détail d’un événement sans catégorie', () => {
    const { wrapper } = mountMember(EventDetail, { props: { event: event({ category: undefined }) } })
    expect(wrapper.find('.v-card-subtitle').text()).toBe('UNADF')
  })
})
