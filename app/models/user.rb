class User < ActiveRecord::Base
  rolify
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :invitable, :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :invitable, :validate_on_invite => true

  has_attached_file :avatar, :styles => { medium: "300x300#", thumb: "100x100#" }, default_url: "default_avatar.png"
  validates_attachment_content_type :avatar, content_type: /\Aimage\/.*\z/


  has_many :is_memberships, :as => :is_memberable, :class_name => 'Membership'

  has_many :is_members_structures, through: :is_memberships, source: :is_memberable, source_type: 'Structure'

  validates :firstname, :lastname, presence: true


  def fullname
    firstname + " " + lastname
  end
  alias name fullname

  def full_address
    result = ""
    unless address_1.blank?
      result = address_1 + "<br>"
    end
    unless address_2.blank?
      result = result + address_2 + "<br>"
    end
    unless zipcode.blank?
      result = result + zipcode
    end
    unless town.blank?
      result = result + " " + town
    end
    result.html_safe
  end

  def friendly_id
    sprintf '%05d', id
  end

  def self.global_search q
    where(['(firstname LIKE ? OR lastname LIKE ? OR email LIKE ? OR id LIKE ?)', "#{q}%", "#{q}%", "#{q}%", "#{q}%"])
  end

 end
