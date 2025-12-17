class Api::FeesController < ApiController
  before_action :set_fee, only: [:show, :update, :destroy]

  def index
    fees = Fee.all

    if params[:search].present?
      fees = fees.where(
        "what LIKE :q",
        q: "%#{params[:search]}%"
      )
    end

    render json: {fees: fees.as_json(include: :member)}
  end

  def show
    render json: { fee: @fee.as_json.merge(member: @fee.member_type + '-' + @fee.member_id.to_s) }
  end

  def create
    fee = Fee.new(fee_params)

    # split member type-id combined field
    if params[:fee][:member].present?
      member_type, member_id = params[:fee][:member].split('-')
      fee.member_type = member_type
      fee.member_id   = member_id
    end

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
    params[:fee].permit(:what, :amount, :paid_at)
  end

end