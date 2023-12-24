require 'api_constraints'

Rails.application.routes.draw do

  devise_for :users, controllers: {
    invitations: 'users/invitations',
    sessions: 'users/sessions',
    passwords: 'users/passwords'
  }

  get '/support', to: 'pages#support'
  get '/app', to: 'pages#app'

  get '/connexion', to: 'pages#connexion'
  get '/mot-de-passe-oublie', to: 'pages#forgot_password'

  resources :logos, only: :show
  resources :avatars, only: :show

  namespace :api, defaults: { format: 'json' } do
    get 'current_user', to: 'current_user#show'
    get 'switch/:id', to: 'current_user#switch', as: :switch_user
    get 'switch_back', to: 'current_user#switch_back', as: :switch_back
    post 'connect_with_google', to: 'sessions#connect_with_google', as: :connect_with_google

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

    resources :files, only: [:destroy]

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

  authenticated :user do

    # ADMIN SUBDOMAIN
    namespace :admin, path: '' do
      constraints(:subdomain => /admin/) do
        resources :users, only: :index
        resources :churches, only: :index
        resources :associations, only: :index
        resources :events, only: :index
        resources :posts, only: :index
        resources :roles, only: :index

        resources :campaigns do
          get '/open', to: 'campaigns#open', as: :open
          get '/close_definitly', to: 'campaigns#close_definitly', as: :close_definitly
          get '/close_temporarily', to: 'campaigns#close_temporarily', as: :close_temporarily
        end
        resources :intranets
        root to: redirect('/users'), as: :root
      end
    end

    namespace :me, path: '' do
      constraints(:subdomain => 'me') do
        get '/feed', to: 'feed#show', as: :feed

        root to: redirect('/feed'), as: :me
      end
    end

    # ITNTRANETS SUBDOMAIN
    namespace :intranet, path: '' do
      constraints(:subdomain => /[a-z]+/) do
        resources :users, only: :index
        resources :churches, only: :index
        resources :associations, only: :index
        resources :events, only: :index
        resources :posts, only: :index
        resources :campaigns, only: :index

        get '/mon-compte', :to => redirect('/events')

        root to: redirect('/users'), as: :root
      end
    end

    # VOTES SPACES
    namespace :votes, path: '' do
      constraints(:subdomain => '') do
        resources :campaigns, only: [:index, :show]
        resources :results, only: [:index, :show]
        post '/voting', to: 'votings#create', as: :voting
        root :to => redirect('/campaigns')
      end
    end

    resources :users, only: [:show, :index]
  end

  post 'uploader/image', to: 'uploader#image'
  root to: redirect('/connexion')

end
