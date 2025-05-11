require 'api_constraints'

Rails.application.routes.draw do

  devise_for :users, controllers: {
    invitations: 'users/invitations',
    sessions: 'users/sessions',
    passwords: 'users/passwords'
  }

  get '/support', to: 'pages#support'
  get '/app', to: 'pages#app'
  get 'privacy', to: 'pages#privacy'

  get '/connexion', to: 'pages#connexion'
  get '/mot-de-passe-oublie', to: 'pages#forgot_password'

  resources :logos, only: :show
  resources :avatars, only: :show

  namespace :api, defaults: { format: 'json' } do
    get 'current_user', to: 'current_user#show'
    get 'switch/:id', to: 'current_user#switch', as: :switch_user
    get 'switch_back', to: 'current_user#switch_back', as: :switch_back
    post 'connect_with_google', to: 'sessions#connect_with_google', as: :connect_with_google
    post 'login', to: 'sessions#login', as: :login

    resources :users
    patch '/users/:id/enable', to: 'users#enable'
    patch '/users/:id/disable', to: 'users#disable'
    patch '/users/:id/add_role', to: 'users#add_role'
    patch '/users/:id/remove_role', to: 'users#remove_role'
    post '/users/:id/send_invitation', to: 'users#send_invitation'

    resources :churches
    post '/churches/:id/members', to: 'churches#add_members'
    delete '/churches/:id/members/:membership_id', to: 'churches#remove_members'
    post '/churches/:id/roles/edit', to: 'churches#edit_roles'

    resources :associations
    post '/associations/:id/members', to: 'associations#add_members'
    post '/associations/:id/roles/edit', to: 'associations#edit_roles'

    resources :fees

    get '/profile', to: 'profile#show'

    get '/search', to: 'search#index'

    namespace :me do
      resources :events, only: [:index]
    end

    resources :memberships, only: [:update, :destroy]

    resources :campaigns
    patch '/campaigns/:id/change_state', to: 'campaigns#change_state'
    get '/campaigns/:id/voters_count', to: 'campaigns#voters_count'
    resources :events
    resources :posts
    resources :votes, only: [:index, :show, :create]
    resources :feed, only: [:index]

    resources :roles
    resources :meetings
    post '/meetings/:id/add_attendees', to: 'meetings#add_attendees'
    post '/meetings/:id/remove_attendees', to: 'meetings#remove_attendees'

    resources :files, only: [:destroy]
    resources :documents
    post '/update_order_documents', to: 'documents#update_order'
    resources :categories

    get 'referentiels/:referentiel', to: 'referentiels#show'
    get 'menus/:menu', to: 'menus#show'

  end

  namespace :v1, module: :v1, constraints: ApiConstraints.new(version: 1, default: :true, domain: Rails.application.secrets.domain_name), defaults: { format: 'json' } do
    devise_for :users, controllers: {
      sessions: 'v1/custom_devise/sessions'
    }, as: :api_devise

    get '/users/:token', to: 'users#show'
    get '/votes', to: 'votes#index'
    get '/votes/:id', to: 'votes#show'
    post '/votes', to: 'votes#create'
  end

  # ADMIN SUBDOMAIN
  namespace :admin do
    resources :users, only: :index
    resources :churches, only: :index
    resources :associations, only: :index
    resources :campaigns, only: :index
    resources :events, only: :index
    resources :posts, only: :index
    resources :roles, only: :index
    resources :meetings, only: :index
    resources :fees, only: :index
    resources :documents, only: :index

    root to: redirect('/admin/users'), as: :root
  end

  # ASSOCIATION SUBDOMAIN
  namespace :association do
    resources :associations, only: :index
    resources :campaigns, only: :index
    resources :events, only: :index
    resources :posts, only: :index
    resources :users, only: :index
    resources :churches, only: :index

    root to: redirect('/association/campaigns'), as: :root
  end

  # ME SUBDOMAIN
  namespace :me, path: '' do
    get '/feed', to: 'feed#show', as: :feed
    get '/annuaire', to: 'annuaire#show', as: :annuaire
    get '/mon-profil', to: 'profile#show', as: :me
    get '/documents', to: 'documents#index', as: :documents
    get '/campaigns', to: 'campaigns#index', as: :votes

    root to: redirect('/feed'), as: :root
  end

  get '/campaigns/:id', to: 'campaigns#show'

  root to: redirect('/connexion')
end
