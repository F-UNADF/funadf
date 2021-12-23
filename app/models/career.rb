class Career < ActiveRecord::Base
  belongs_to :user
  belongs_to :referent, class_name: "User", foreign_key: :referent_id

  belongs_to :church
  belongs_to :assoc, class_name: "Association", foreign_key: :association_id

  delegate :fullname, to: :referent, prefix: true, allow_nil: true
  delegate :name, to: :church, prefix: true, allow_nil: true
  delegate :name, to: :assoc, prefix: true, allow_nil: true

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
