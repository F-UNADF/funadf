class Elector < ActiveRecord::Base

  belongs_to :resource, polymorphic: true
  belongs_to :structure

  validates :structure, :resource_id, :resource_type, presence: true

  def get_class
    resource.get_class
  end

  def campaigns
    self.structure.campaigns
  end

end
