Rails.application.routes.draw do

  mount RailsEmailPreview::Engine, at: 'emails'
  devise_for :users, controllers: { invitations: 'users/invitations' }


  authenticated :user do

    # ADMIN SUBDOMAIN
    namespace :admin, path: '' do
      constraints(:subdomain => /admin/) do
        resources :users do
          get '/admins/new', to: "admins#new", as: :new_admin
          post '/admins/delete', to: "admins#destroy", as: :admin
          get '/enable', to: "users#enable", as: :enable
          get '/disable', to: "users#disable", as: :disable
        end
        resources :campaigns do
          get '/open', to: 'campaigns#open', as: :open
          get '/close_definitly', to: 'campaigns#close_definitly', as: :close_definitly
          get '/close_temporarily', to: 'campaigns#close_temporarily', as: :close_temporarily
        end
        resources :intranets

        root :to => redirect('/users'), as: :root
      end
    end

    # ITNTRANETS SUBDOMAIN
    namespace :intranet, path: '' do
      constraints(:subdomain => /[a-z]+/) do
        resources :events
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

  root to: redirect('/users/sign_in')

end
