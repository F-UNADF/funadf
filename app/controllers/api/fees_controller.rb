class Api::FeesController < ApiController
  before_action :set_fee, only: [:show, :update, :destroy]

  def index
    render json: { fees: Fee.all }, include: ['user']
  end

  def show
    render json: { fee: @fee }
  end

  def create
    fee = Fee.new(fee_params)

    if fee.save
      render json: { status: 200, fee: fee }
    else
      render json: { status: 422, errors: fee.errors }
    end
  end

  def update
    if @fee.update(fee_params)
      render json: { status: 200, fee: @fee }
    else
      render json: { status: 422, errors: @fee.errors }
    end
  end

  def destroy
    @fee.destroy
    render json: { status: 200 }
  end

  private

  def set_fee
    @fee = Fee.find(params[:id])
  end

  def fee_params
    params[:fee].permit(:what, :user_id, :amount, :paid_at)
  end

end