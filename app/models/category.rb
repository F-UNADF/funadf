class Category < ActiveRecord::Base

  belongs_to :structure
  belongs_to :category, optional: true

  has_many :events, dependent: :nullify
  has_many :documents, dependent: :nullify

  validates :name, presence: true

  def font_color
    # remove hashtag
    c = color

    hexa = c.gsub! '#', ''

    r = hexa[0..1].hex
    g = hexa[2..3].hex
    b = hexa[4..5].hex

    if (r * 0.299 + g * 0.587 + b * 0.114) > 186
      '#000000'
    else
      '#ffffff'
    end
  end

end
