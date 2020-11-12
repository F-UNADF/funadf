class Meeting < ActiveRecord::Base

	has_many :campaigns, dependent: :nullify

  validates :name, presence: true


  def dates
    if !self.begin_at.blank? && !self.end_at.blank?
      "Du #{I18n.l self.begin_at} au #{I18n.l self.end_at}"
    elsif !self.begin_at.blank? && self.end_at.blank?
      "Du #{I18n.l self.begin_at}"
    else
      "Date non renseigné"
    end
  end

end
