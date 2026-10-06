import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import axios from 'axios'
import ProfileShow from '@/components/Profile/Show.vue'
import ArchivateRedirect from '@/components/Archivate/Redirect.vue'
import PrivacyPage from '@/components/Pages/PrivacyPage.vue'
import { mountMember, flush, pageText, buttonByText } from './support.js'

vi.mock('axios')

const year = new Date().getFullYear()

// Réponse de GET /api/profile (Api::ProfileController#show)
const profileResponse = (overrides = {}) => ({
  profile: {
    id: 42, firstname: 'Jean', lastname: 'DUPONT', email: 'jean@add.fr', birthdate: '1970-03-21',
    phone_1: '0612345678', address_1: '3 rue de la Paix', zipcode: '69001', town: 'Lyon',
  },
  gratitudes: [
    { id: 1, level: 'Pasteur stagiaire', start_at: '2005-09-01' },
    { id: 2, level: 'Pasteur APE', start_at: '2012-09-01' },
  ],
  fees: [{ id: 1, what: String(year) }, { id: 2, what: String(year - 2) }],
  presidences: [
    { id: 8, name: 'Église de Lyon', mtype: 'Church', zipcode: '69002', town: 'Lyon' },
    { id: 9, name: 'ADD Jeunesse', mtype: 'Association', zipcode: '75001', town: 'Paris' },
  ],
  phases: [
    { id: 1, function: 'Pasteur principal', church_name: 'Église de Lyon(Lyon)', start_at: '2012-09-01', end_at: null },
    { id: 2, function: 'Pasteur adjoint', church_name: 'Église de Vienne(Vienne)', start_at: '2005-09-01', end_at: '2012-08-31' },
    { id: 3, function: 'Stagiaire', church_name: 'Église X', start_at: null, end_at: null },
  ],
  responsabilities: [],
  roles: ['admin', 'president'],
  ...overrides,
})

describe('Mon profil', () => {
  beforeEach(() => vi.clearAllMocks())
  afterEach(() => { document.body.innerHTML = '' })

  it('charge GET /api/profile et affiche identité, reconnaissance, rôles et coordonnées', async () => {
    axios.get.mockResolvedValue({ data: profileResponse() })
    const { wrapper } = mountMember(ProfileShow)
    await flush()

    expect(axios.get).toHaveBeenCalledWith('/api/profile', {})
    expect(wrapper.find('h2').text()).toBe('DUPONT Jean')
    expect(pageText()).toContain('Pasteur APE') // reconnaissance la plus récente
    expect(pageText()).toContain('00042')
    expect(pageText()).toContain('Administrateur')
    expect(pageText()).toContain('president')
    expect(pageText()).toContain('21/03/1970')
    expect(pageText()).toContain('3 rue de la Paix, 69001 Lyon')
    expect(pageText()).toContain('jean@add.fr')
    expect(wrapper.find('.v-avatar .v-img').exists()).toBe(true)
    expect(wrapper.vm.getAvatar).toBe('/avatars/42.png')
  })

  it('cotisations des 5 dernières années : payées et non payées', async () => {
    axios.get.mockResolvedValue({ data: profileResponse() })
    const { wrapper } = mountMember(ProfileShow)
    await flush()
    const labels = wrapper.findAll('[aria-label$="payée"]').map(c => c.attributes('aria-label'))
    expect(labels).toEqual([
      `${year} : payée`, `${year - 1} : non payée`, `${year - 2} : payée`, `${year - 3} : non payée`, `${year - 4} : non payée`,
    ])
  })

  it('parcours et présidences', async () => {
    axios.get.mockResolvedValue({ data: profileResponse() })
    const { wrapper } = mountMember(ProfileShow)
    await flush()
    expect(pageText()).toContain('Depuis le 01/09/2012')
    expect(pageText()).toContain('Du 01/09/2005 au 31/08/2012')
    expect(pageText()).toContain('Église de Vienne(Vienne)')
    expect(pageText()).toContain('ADD Jeunesse')
    expect(pageText()).toContain('75001 Paris')
    expect(wrapper.find('[aria-label="Église"]').exists()).toBe(true)
    expect(wrapper.find('[aria-label="Association"]').exists()).toBe(true)
    expect(wrapper.vm.getLogo(8)).toBe('/logos/8.png')
    expect(wrapper.vm.getLogo(null)).toBeUndefined()
    expect(wrapper.vm.getIcon('Region')).toBeUndefined()
  })

  it('profil peu renseigné : états vides', async () => {
    axios.get.mockResolvedValue({ data: profileResponse({
      profile: { id: 5, firstname: 'Paul', lastname: 'MARTIN', birthdate: null },
      gratitudes: [], fees: [], presidences: [], phases: [], roles: [],
    }) })
    mountMember(ProfileShow)
    await flush()
    expect(pageText()).toContain('Reconnaissance non renseignée')
    expect(pageText()).toContain('Aucune reconnaissance enregistrée.')
    expect(pageText()).toContain('Aucun parcours enregistré.')
    expect(pageText()).toContain('Aucune présidence en cours.')
    expect(pageText()).toContain('Non renseigné')
  })

  it('avant chargement : pas d’avatar ni de numéro', () => {
    axios.get.mockReturnValue(new Promise(() => {}))
    const { wrapper } = mountMember(ProfileShow)
    expect(wrapper.vm.getId).toBeUndefined()
    expect(wrapper.find('.v-avatar .v-img').exists()).toBe(false)
    expect(wrapper.vm.formatDate(null)).toBeUndefined()
  })

  it('« Modifier mon profil » charge la fiche GET /api/users/:id et ouvre le formulaire', async () => {
    axios.get.mockImplementation((url) => Promise.resolve({
      data: url === '/api/profile' ? profileResponse() : { user: { id: 42, firstname: 'Jean' } },
    }))
    const { store } = mountMember(ProfileShow)
    await flush()
    buttonByText('Modifier mon profil').click()
    await flush()
    expect(axios.get).toHaveBeenCalledWith('/api/users/42', {})
    expect(store.state.usersStore.dialogForm).toBe(true)
    expect(store.state.usersStore.item).toEqual({ user: { id: 42, firstname: 'Jean' } })
  })
})

describe('Accès à Archivate (SSO)', () => {
  const location = window.location
  beforeEach(() => {
    vi.clearAllMocks()
    delete window.location
    window.location = { href: 'http://app/archivate' }
  })
  afterEach(() => { window.location = location; document.body.innerHTML = '' })

  it('génère un jeton à usage unique et redirige vers Archivate', async () => {
    axios.post.mockResolvedValue({ data: { token: 't', redirect_url: 'https://archivate.example/sso?token=t' } })
    mountMember(ArchivateRedirect)
    expect(pageText()).toContain('Connexion à Archivate…')
    await flush()
    expect(axios.post).toHaveBeenCalledWith('/api/archivate/sso/generate')
    expect(window.location.href).toBe('https://archivate.example/sso?token=t')
  })

  it('échec : message d’erreur et bouton Réessayer qui relance la génération', async () => {
    axios.post.mockRejectedValueOnce(new Error('500'))
    mountMember(ArchivateRedirect)
    await flush()
    expect(pageText()).toContain('Impossible d\'ouvrir Archivate pour le moment.')

    axios.post.mockResolvedValue({ data: { redirect_url: 'https://archivate.example/sso?token=u' } })
    buttonByText('Réessayer').click()
    await flush()
    expect(axios.post).toHaveBeenCalledTimes(2)
    expect(window.location.href).toBe('https://archivate.example/sso?token=u')
  })
})

describe('Pages statiques', () => {
  afterEach(() => { document.body.innerHTML = '' })

  it('politique de confidentialité : contact et droits des utilisateurs', () => {
    const { wrapper } = mountMember(PrivacyPage)
    expect(wrapper.find('h1').text()).toBe('Politique de Confidentialité')
    expect(wrapper.findAll('a[href="mailto:pdt.unadf@addfrance.fr"]')).toHaveLength(2)
    expect(pageText()).toContain('Droits des Utilisateurs')
  })
})
