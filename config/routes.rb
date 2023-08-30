require 'api_constraints'

Rails.application.routes.draw do

  devise_for :users, controllers: { invitations: 'users/invitations' }

  get '/support', to: 'pages#support'
  get '/avatars/:user', to: 'avatars#show'
  get '/logos/:structure', to: 'logos#show'

  namespace :api, defaults: {format: 'json'} do
    get 'current_user', to: 'current_user#show'
    resources :users
    patch '/users/:id/enable', to: 'users#enable'
    patch '/users/:id/disable', to: 'users#disable'

    resources :churches
    post '/churches/:id/members', to: 'churches#add_members'
    delete '/churches/:id/members/:membership_id', to: 'churches#remove_members'
    post '/churches/:id/roles/edit', to: 'churches#edit_roles'


    resources :associations
    post '/associations/:id/members', to: 'associations#add_members'
    post '/associations/:id/roles/edit', to: 'associations#edit_roles'

    resources :memberships, only: [:update, :destroy]

    resources :campaigns
    patch '/campaigns/:id/change_state', to: 'campaigns#change_state'

    get 'referentiels/:referentiel', to: 'referentiels#show'
    get 'menus/:menu', to: 'menus#show'
  end

  namespace :v1, module: :v1, constraints: ApiConstraints.new(version: 1, default: :true, domain: Rails.application.secrets.domain_name), defaults: {format: 'json'} do
    devise_for :users, controllers: {
        sessions: 'v1/custom_devise/sessions'
    }, as: :api_devise

    get '/users/:token', to: 'users#show'
    get '/votes', to: 'votes#index'
    get '/votes/:id', to: 'votes#show'
    post '/votes', to: 'votes#create'
  end

  authenticated :user do

    # ADMIN SUBDOMAIN
    namespace :admin, path: '' do
      constraints(:subdomain => /admin/) do
        resources :users, only: :index
        resources :churches, only: :index
        resources :associations, only: :index


        resources :campaigns do
          get '/open', to: 'campaigns#open', as: :open
          get '/close_definitly', to: 'campaigns#close_definitly', as: :close_definitly
          get '/close_temporarily', to: 'campaigns#close_temporarily', as: :close_temporarily
        end
        resources :intranets
        root to: 'pages#home', as: :root
      end
    end

    namespace :me, path: '' do
      constraints(:subdomain => 'me') do

        get '/mon-profil', to: 'profile#show', as: :profile

        resources :structures, only: :show
        resources :users, only: :show
        resources :events, only: :show

        get '/rechercher', to: 'search#show', as: :search
        get '/searching', to: 'search#index'

        get '/feed', to: 'feed#index'

        root to: redirect('/feed'), as: :me
      end
    end

    # ITNTRANETS SUBDOMAIN
    namespace :intranet, path: '' do
      constraints(:subdomain => /[a-z]+/) do
        resources :events
        resources :users
        resources :structures
        resources :categories
        resources :posts
        resource :the_structure, controller: 'structure', only: [:show, :edit, :update]
        root to: 'home#show', as: :intranet
      end
    end

    # VOTES SPACES
    namespace :votes, path: '' do
      constraints(:subdomain => '') do
        resources :campaigns
        resources :results, only: [:index, :show]
        post '/voting', to: 'votings#create', as: :voting
        root :to => redirect('/mon-compte'), as: :authenticated_user
      end
    end

    # EACH SPACES
    resources :structures do
      resources :has_memberships, controller: 'structures/has_memberships', except: :create
      resources :campaigns, controller: 'structures/campaigns' do
        get '/open', to: 'structures/campaigns#open', as: :open
        get '/close_definitly', to: 'structures/campaigns#close_definitly', as: :close_definitly
        get '/close_temporarily', to: 'structures/campaigns#close_temporarily', as: :close_temporarily
      end

      get '/has_memberships/:member_id/:member_type', to: 'structures/has_memberships#create', as: :add_memberships
      delete '/has_memberships/:member_id/:member_type', to: 'structures/has_memberships#destroy', as: :delete_memberships

      post '/resource/:resource_id/:resource_type', to: 'structures/has_memberships#update'
      post '/reason/:resource_id/:resource_type', to: 'structures/has_memberships#reason'

      resources :is_memberships, controller: 'structures/is_memberships'
      get '/roles/:resource_id/:resource_type/edit', to: 'structures/roles#edit', as: :edit_structure_resource_roles
      post '/roles/:resource_id/:resource_type/edit', to: 'structures/roles#update', as: :structure_resource_roles
    end

    resources :users, only: [:show, :index]

    get '/mon-compte', to: "accounts#show", as: :me
    get '/mon-compte/modifier', to: 'accounts#edit', as: :edit_me

    resources :accounts, only: :update


    get '/search', to: "search#index", as: :search

    root :to => redirect('/mon-compte'), as: :authenticated_user
  end

  post 'uploader/image', to: 'uploader#image'

  get '/mon-compte', to: redirect('/users/sign_in')
  root to: redirect('/users/sign_in')

end
