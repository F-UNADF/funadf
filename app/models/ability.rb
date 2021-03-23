class Ability
  include CanCan::Ability

  def marshal_dump
    #blocks cannot be cached
    @rules.reject{|rule| rule.instance_variable_get :@block }.map{|rule| Marshal.dump(rule) }
  end
  def marshal_load array


    user ||= User.new

    alias_action :create, :read, :update, :to => :cru

    if user.has_role? :admin
      can :manage, :all
    end

    Structure.all.each do |s|
      if user.has_role? [:president, :secretary, :treasurer, :director], s
        can :cru, s
      end
    end

    @rules += array.map{|rule| Marshal.load(rule) }

  end
end
