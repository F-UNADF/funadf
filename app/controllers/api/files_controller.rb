class Api::FilesController < ApiController
  def destroy
    file = ActiveStorage::Attachment.find(params[:id])
    file.purge
    render json: { status: 200 }
  end
end
