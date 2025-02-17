class Document < ApplicationRecord

  validates :title, presence: true
  has_one_attached :file
  belongs_to :category

  #validate il should have a file OR a url
  validate :file_xor_url

  def file_xor_url
    if file.attached? && url.present?
      errors.add(:file, "can't have a file and a url")
    end
  end

end
