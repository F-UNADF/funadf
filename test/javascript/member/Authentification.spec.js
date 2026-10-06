import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import axios from 'axios'
import SessionIndex from '@/components/Session/Index.vue'
import PasswordIndex from '@/components/Password/Index.vue'
import PasswordCreate from '@/components/Password/Create.vue'
import { mountMember, flush, pageText } from './support.js'

vi.mock('axios')

const inputs = (wrapper) => wrapper.findAll('input')

describe('Connexion', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    axios.defaults = { headers: { common: {} } }
    localStorage.clear()
    sessionStorage.clear()
  })
  afterEach(() => { document.body.innerHTML = '' })

  it('affiche le formulaire de connexion et le lien « Mot de passe oublié »', () => {
    const { wrapper } = mountMember(SessionIndex)
    expect(pageText()).toContain('Connexion')
    expect(pageText()).toContain('Intranet des Assemblées de Dieu de France')
    expect(inputs(wrapper).map(i => i.attributes('type'))).toEqual(['email', 'password'])
    expect(pageText()).toContain('Mot de passe oublié ?')
  })

  it('refuse un formulaire incomplet sans appeler l’API', async () => {
    const { wrapper } = mountMember(SessionIndex)
    await inputs(wrapper)[0].setValue('jean@add.fr')
    await wrapper.find('form').trigger('submit')
    expect(axios.post).not.toHaveBeenCalled()
    expect(wrapper.find('.v-alert').text()).toBe('Saisissez votre adresse e-mail et votre mot de passe.')
  })

  it('POST /api/login, stocke le jeton et redirige vers l’URL renvoyée', async () => {
    axios.post.mockResolvedValue({
      status: 201,
      data: { user: { id: 3, email: 'jean@add.fr' }, token: 'jeton-123', redirect: '/feed' },
    })
    const { wrapper, router, store } = mountMember(SessionIndex)
    await inputs(wrapper)[0].setValue('jean@add.fr')
    await inputs(wrapper)[1].setValue('secret')
    await wrapper.find('form').trigger('submit')
    await flush()

    expect(axios.post).toHaveBeenCalledWith('/api/login', { email: 'jean@add.fr', password: 'secret' })
    expect(localStorage.getItem('token')).toBe('jeton-123')
    expect(sessionStorage.getItem('token')).toBe('jeton-123')
    expect(axios.defaults.headers.common.Authorization).toBe('Bearer jeton-123')
    expect(store.getters['sessionStore/currentUser']).toEqual({ id: 3, email: 'jean@add.fr' })
    expect(router.push).toHaveBeenCalledWith('/feed')
    expect(wrapper.find('.v-alert').exists()).toBe(false)
  })

  it('l’API renvoie une URL absolue (root_url) : le routeur reçoit seulement le chemin', async () => {
    axios.post.mockResolvedValue({ data: { user: { id: 3 }, token: 't', redirect: 'https://app.addfrance.fr/' } })
    const { wrapper, router } = mountMember(SessionIndex)
    await inputs(wrapper)[0].setValue('jean@add.fr')
    await inputs(wrapper)[1].setValue('secret')
    await wrapper.find('form').trigger('submit')
    await flush()
    expect(router.push).toHaveBeenCalledWith('/')
  })

  it('identifiants refusés (401) : message d’erreur, aucun jeton stocké', async () => {
    axios.post.mockRejectedValue({ response: { status: 401, data: { error: 'Invalid email or password' } } })
    const { wrapper, router } = mountMember(SessionIndex)
    await inputs(wrapper)[0].setValue('jean@add.fr')
    await inputs(wrapper)[1].setValue('faux')
    await wrapper.find('form').trigger('submit')
    await flush()

    expect(wrapper.find('.v-alert').text()).toContain('Adresse e-mail ou mot de passe incorrect.')
    expect(localStorage.getItem('token')).toBeNull()
    expect(router.push).not.toHaveBeenCalled()
    expect(wrapper.vm.loading).toBe(false)
  })

  it('ignore un second envoi pendant la connexion en cours', async () => {
    axios.post.mockReturnValue(new Promise(() => {}))
    const { wrapper } = mountMember(SessionIndex)
    await inputs(wrapper)[0].setValue('jean@add.fr')
    await inputs(wrapper)[1].setValue('secret')
    await wrapper.find('form').trigger('submit')
    await wrapper.find('form').trigger('submit')
    expect(axios.post).toHaveBeenCalledTimes(1)
  })

  it('le bouton œil affiche puis masque le mot de passe', async () => {
    const { wrapper } = mountMember(SessionIndex)
    const eye = wrapper.find('[aria-label="Afficher le mot de passe"]')
    await eye.trigger('click')
    expect(inputs(wrapper)[1].attributes('type')).toBe('text')
    expect(wrapper.find('[aria-label="Masquer le mot de passe"]').attributes('aria-pressed')).toBe('true')
  })
})

describe('Mot de passe oublié', () => {
  beforeEach(() => vi.clearAllMocks())
  afterEach(() => { document.body.innerHTML = '' })

  it('exige une adresse e-mail', async () => {
    const { wrapper } = mountMember(PasswordIndex)
    await wrapper.find('form').trigger('submit')
    expect(pageText()).toContain('Saisissez votre adresse e-mail.')
    expect(axios.post).not.toHaveBeenCalled()
  })

  it('POST /users/password avec l’e-mail, confirme l’envoi et revient à la connexion', async () => {
    axios.post.mockResolvedValue({ data: { message: 'Email sent' } })
    const { wrapper, router, snackbar } = mountMember(PasswordIndex)
    await wrapper.find('input').setValue('jean@add.fr')
    await wrapper.find('form').trigger('submit')
    await flush()

    expect(axios.post).toHaveBeenCalledWith('/users/password', { email: 'jean@add.fr' })
    expect(snackbar).toHaveBeenCalledWith(expect.stringContaining('Un e-mail vient de vous être envoyé.'), 'success')
    expect(router.push).toHaveBeenCalledWith('/connexion')
  })

  it('adresse inconnue (404) : message sous le champ, on reste sur la page', async () => {
    axios.post.mockRejectedValue({ response: { status: 404 } })
    const { wrapper, router } = mountMember(PasswordIndex)
    await wrapper.find('input').setValue('inconnu@add.fr')
    await wrapper.find('form').trigger('submit')
    await flush()

    expect(pageText()).toContain('Aucun compte ne correspond à cette adresse e-mail.')
    expect(router.push).not.toHaveBeenCalled()
    expect(wrapper.vm.loading).toBe(false)
  })

  it('ignore un second envoi pendant la demande en cours', async () => {
    axios.post.mockReturnValue(new Promise(() => {}))
    const { wrapper } = mountMember(PasswordIndex)
    await wrapper.find('input').setValue('jean@add.fr')
    await wrapper.find('form').trigger('submit')
    await wrapper.find('form').trigger('submit')
    expect(axios.post).toHaveBeenCalledTimes(1)
  })
})

describe('Nouveau mot de passe (lien de l’e-mail)', () => {
  beforeEach(() => vi.clearAllMocks())
  afterEach(() => { document.body.innerHTML = '' })

  const route = { params: {}, query: { reset_password_token: 'tok-abc' } }

  async function fill(wrapper, password, confirmation) {
    const [first, second] = wrapper.findAll('input')
    await first.setValue(password)
    await second.setValue(confirmation)
  }

  it('refuse un mot de passe trop court ou non confirmé, sans appel à l’API', async () => {
    const { wrapper } = mountMember(PasswordCreate, { route })
    await fill(wrapper, 'abc', 'abd')
    await wrapper.vm.password_reset()
    await flush()
    expect(pageText()).toContain('Le mot de passe doit contenir au moins 6 caractères.')
    expect(pageText()).toContain('Les deux mots de passe ne sont pas identiques.')
    expect(axios.put).not.toHaveBeenCalled()
  })

  it('champs vides : demande de les saisir', async () => {
    const { wrapper } = mountMember(PasswordCreate, { route })
    await wrapper.vm.password_reset()
    await flush()
    expect(pageText()).toContain('Saisissez un mot de passe.')
    expect(pageText()).toContain('Confirmez le mot de passe.')
  })

  it('PUT /users/password avec le jeton du lien, puis retour à la connexion', async () => {
    axios.put.mockResolvedValue({ data: { message: 'Password updated' } })
    const { wrapper, router, snackbar } = mountMember(PasswordCreate, { route })
    await fill(wrapper, 'nouveau1', 'nouveau1')
    await wrapper.find('form').trigger('submit')
    await flush(); await flush()

    expect(axios.put).toHaveBeenCalledWith('/users/password', {
      password: 'nouveau1', password_confirmation: 'nouveau1', reset_password_token: 'tok-abc',
    })
    expect(snackbar).toHaveBeenCalledWith('Votre mot de passe est enregistré. Vous pouvez vous connecter.', 'success')
    expect(router.push).toHaveBeenCalledWith('/connexion')
  })

  it('lien expiré (422) : message d’erreur, pas de redirection', async () => {
    axios.put.mockRejectedValue({ response: { status: 422 } })
    const { wrapper, router, snackbar } = mountMember(PasswordCreate, { route })
    await fill(wrapper, 'nouveau1', 'nouveau1')
    await wrapper.vm.password_reset()
    await flush()

    expect(snackbar).toHaveBeenCalledWith(expect.stringContaining('Le lien a peut-être expiré'), 'error')
    expect(router.push).not.toHaveBeenCalled()
    expect(wrapper.vm.loading).toBe(false)
  })

  it('ignore un envoi pendant l’enregistrement en cours ; le bouton œil affiche les deux champs', async () => {
    const { wrapper } = mountMember(PasswordCreate, { route })
    wrapper.vm.loading = true
    await wrapper.vm.password_reset()
    expect(axios.put).not.toHaveBeenCalled()

    await wrapper.find('[aria-label="Afficher les mots de passe"]').trigger('click')
    expect(wrapper.findAll('input').map(i => i.attributes('type'))).toEqual(['text', 'text'])
  })
})
