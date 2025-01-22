class Meeting < ActiveRecord::Base
    validates :name, presence: true

    has_many :campaigns, dependent: :nullify
    has_many :attendees, dependent: :delete_all
    has_many :users, through: :attendees

    def user_is_present?(user)
        users.include?(user)
    end
end
