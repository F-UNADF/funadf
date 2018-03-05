Rails.application.routes.draw do

  devise_for :users, controllers: { invitations: 'users/invitations' }

  authenticated :user do
    namespace :admin do
      resources :users do
        get '/admins/new', to: "admins#new", as: :new_admin
        post '/admins/delete', to: "admins#destroy", as: :admin
      end
      resources :structures, only: [:new, :index, :destroy]
    end

    resources :structures, except: [:new, :index, :destroy] do
      resources :has_memberships, controller: 'structures/has_memberships', except: :create
      resources :campaigns, controller: 'structures/campaigns'
      get '/has_memberships/:member_id/:member_type', to: 'structures/has_memberships#create', as: :add_memberships
      resources :is_memberships, controller: 'structures/is_memberships'
      get '/roles/:resource_id/:resource_type/edit', to: 'structures/roles#edit', as: :edit_structure_resource_roles
      post '/roles/:resource_id/:resource_type/edit', to: 'structures/roles#update', as: :structure_resource_roles
    end

    resources :users, only: [:show, :index]
    resources :structures

    get '/mon-compte', to: "accounts#show", as: :me
    get '/mon-compte/modifier', to: 'accounts#edit', as: :edit_me

    get '/search', to: "search#index", as: :search

    resources :accounts, only: :update
    root 'pages#home', as: :authenticated_root

  end
  root to: redirect('/users/sign_in')

end
