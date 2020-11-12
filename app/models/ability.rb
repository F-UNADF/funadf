class Ability
  include CanCan::Ability

  def initialize(user)

    user ||= User.new

    alias_action :create, :read, :update, :to => :cru

    if user.has_role? :admin
      # can :manage, :all
    end

    Structure.all.each do |s|
      if user.has_role? [:president, :secretary, :treasurer, :director], s
        can :cru, s
      end
    end
  end
end
