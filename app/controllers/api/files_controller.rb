class Api::FilesController < ApiController
  # Suppression d'une pièce jointe : admin, ou gestionnaire de l'actu / de l'événement.
  def destroy
    file = ActiveStorage::Attachment.find(params[:id])
    return forbidden! unless can_delete?(file)

    file.purge
    render json: { status: 200 }
  end

  private

  def can_delete?(file)
    return true if admin?

    record = file.record
    record.is_a?(Post) || record.is_a?(Event) ? can_manage_structure?(record.structure_id) : false
  end
end
