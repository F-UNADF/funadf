class Gratitude < ActiveRecord::Base
  belongs_to :user
  belongs_to :referent, class_name: "User", foreign_key: :referent_id

  delegate :fullname, to: :referent, prefix: true, allow_nil: true

  def get_dates

    if start_at && end_at
      "Du #{I18n.l start_at} au #{I18n.l end_at}"
    elsif start_at
      "Depuis le #{I18n.l start_at}"
    else
      "Non renseigné"
    end

  end
end
