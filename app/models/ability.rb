class Ability
  include CanCan::Ability

  def initialize(user)

    user ||= User.new
    if user.has_role? :admin
        can :manage, :all
    end

    Structure.all.each do |s|
      if user.has_any_role? s
        can :view, s
      end
    end
  end
end
