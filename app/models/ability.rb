class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new

    alias_action :create, :read, :update, :to => :cru

    if user.has_role? :admin
      can :manage, :all
    end

    if user.has_role? :moderator
      can [:read, :update, :switch], User
    end

    if user.has_role? :steward
      can [:read, :update], Structure
    end

    user.structures.each do |s|
      if user.has_role? [:president, :secretary, :treasurer, :director], s
        can :cru, s
      end
    end
  end
end
