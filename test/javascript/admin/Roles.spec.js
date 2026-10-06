import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import RolesIndex from '@/components/Roles/Index.vue'
import { mountAdmin, flush, click, fill, apiError, text, dialog } from './support.js'

vi.mock('axios')

const roles = [
  { id: 1, name: 'admin', friendly_name: 'Administrateur', short_descriptions: 'Accès complet' },
  { id: 7, name: 'president', friendly_name: 'Président', short_descriptions: 'Préside une structure' },
  { id: 9, name: 'tresorier', friendly_name: null, short_descriptions: '' },
]

async function mountIndex(items = roles) {
  axios.get.mockImplementation((url) => url === '/api/roles'
    ? Promise.resolve({ data: { roles: items } })
    : Promise.resolve({ data: { role: items.find(r => url.endsWith('/' + r.id)) } }))
  const mounted = mountAdmin(RolesIndex)
  await flush()
  return mounted
}

describe('Rôles : liste', () => {
  beforeEach(() => vi.resetAllMocks())

  it('charge les rôles et affiche nom lisible et identifiant technique', async () => {
    const { wrapper } = await mountIndex()
    expect(axios.get).toHaveBeenCalledWith('/api/roles', {})
    const rows = wrapper.findAll('tbody tr').map(r => r.findAll('td').slice(0, 2).map(c => c.text()))
    expect(rows).toEqual([
      ['Administrateur', 'admin'],
      ['Président', 'president'],
      ['tresorier', 'tresorier'], // sans nom lisible : l'identifiant
    ])
  })

  it('sans rôle : message et bouton d’ajout', async () => {
    const { wrapper } = await mountIndex([])
    expect(text(wrapper)).toContain('Aucun rôle pour le moment')
    await click('Ajouter un rôle', wrapper.find('.list-empty').element)
    expect(text(dialog())).toContain('Ajouter un rôle')
  })

  it('recherche sans résultat puis effacement', async () => {
    const { wrapper } = await mountIndex()
    await wrapper.find('input').setValue('zzz')
    await flush()
    expect(text(wrapper)).toContain('Aucun rôle ne correspond à « zzz »')
    await click('Effacer la recherche')
    expect(text(wrapper)).toContain('Administrateur')
  })

  it('Actualiser recharge la liste', async () => {
    await mountIndex()
    axios.get.mockClear()
    await click('Actualiser la liste')
    expect(axios.get).toHaveBeenCalledWith('/api/roles', {})
  })
})

describe('Rôles : création et modification', () => {
  beforeEach(() => vi.resetAllMocks())

  it('crée un rôle : l’identifiant est déduit du nom (sans accents ni espaces)', async () => {
    const { wrapper, snackbar } = await mountIndex()
    await click('Ajouter un rôle')
    const form = dialog()
    await fill('Nom', 'Secrétaire général', form)
    expect(wrapper.vm.$store.state.rolesStore.item.id).toBeNull()
    expect(form.querySelectorAll('input')[1].value).toBe('secretaire_general')
    await fill('Description', 'Tient les registres', form)

    axios.post.mockResolvedValue({ data: { role: { id: 12, name: 'secretaire_general', friendly_name: 'Secrétaire général' } } })
    await click('Enregistrer', form)

    expect(axios.post).toHaveBeenCalledWith('/api/roles', {
      role: expect.objectContaining({
        id: null, friendly_name: 'Secrétaire général', name: 'secretaire_general', short_descriptions: 'Tient les registres',
      }),
    })
    expect(snackbar).toHaveBeenCalledWith('Rôle enregistré avec succès', 'success')
    expect(wrapper.vm.$store.state.rolesStore.dialogForm).toBe(false)
    expect(text(wrapper)).toContain('Secrétaire général')
  })

  it('modifie un rôle : GET /api/roles/:id, PATCH sans toucher à l’identifiant', async () => {
    const { wrapper, snackbar } = await mountIndex()
    await wrapper.findAll('button').filter(b => b.attributes('aria-label') === 'Modifier le rôle')[1].trigger('click')
    await flush()
    expect(axios.get).toHaveBeenCalledWith('/api/roles/7', {})

    const form = dialog()
    expect(text(form)).toContain('Modifier un rôle')
    expect(form.querySelector('input').value).toBe('Président')
    await fill('Nom', 'Présidente', form)
    expect(form.querySelectorAll('input')[1].value).toBe('president')

    axios.patch.mockResolvedValue({ data: { role: { ...roles[1], friendly_name: 'Présidente' } } })
    await click('Enregistrer', form)

    expect(axios.patch).toHaveBeenCalledWith('/api/roles/7', expect.objectContaining({
      id: 7, name: 'president', friendly_name: 'Présidente',
    }))
    expect(snackbar).toHaveBeenCalledWith('Rôle enregistré avec succès', 'success')
    expect(text(wrapper)).toContain('Présidente')
  })

  it('affiche les erreurs de validation', async () => {
    const { snackbar } = await mountIndex()
    await click('Ajouter un rôle')
    axios.post.mockRejectedValue(apiError(['Name a déjà été pris']))
    await click('Enregistrer', dialog())
    expect(snackbar).toHaveBeenCalledWith('Un probleme est survenu lors de l\'enregistrement du rôle', 'error')
    expect(snackbar).toHaveBeenCalledWith('Name a déjà été pris', 'error')
  })

  it('Annuler ferme le formulaire et oublie la saisie', async () => {
    const { wrapper } = await mountIndex()
    await click('Ajouter un rôle')
    await fill('Nom', 'Brouillon', dialog())
    await click('Annuler', dialog())
    expect(wrapper.vm.$store.state.rolesStore.dialogForm).toBe(false)
    expect(wrapper.vm.$store.state.rolesStore.item).toEqual({})
  })
})

describe('Rôles : suppression', () => {
  beforeEach(() => vi.resetAllMocks())

  it('demande confirmation puis supprime le rôle choisi', async () => {
    const { wrapper, snackbar } = await mountIndex()
    await wrapper.findAll('button').filter(b => b.attributes('aria-label') === 'Supprimer le rôle')[1].trigger('click')
    await flush()
    expect(text(dialog())).toContain('Supprimer le rôle ?')
    expect(text(dialog())).toContain('Président')

    axios.delete.mockResolvedValue({ data: { message: 'Role deleted' } })
    await click('Supprimer', dialog())

    expect(axios.delete).toHaveBeenCalledWith('/api/roles/7', {})
    expect(snackbar).toHaveBeenCalledWith('Rôle supprimé avec succès', 'success')
    expect(wrapper.vm.dialogConfirmDelete).toBe(false)
    expect(text(wrapper)).not.toContain('Président')
  })

  it('Annuler ne supprime rien', async () => {
    const { wrapper } = await mountIndex()
    await click('Supprimer le rôle')
    await click('Annuler', dialog())
    expect(wrapper.vm.dialogConfirmDelete).toBe(false)
    expect(axios.delete).not.toHaveBeenCalled()
  })
})
