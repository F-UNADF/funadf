class Api::ConfigController < ApiController
    def show
        render json: UiConfig::ConfigFactory.build(params[:model])
    end
end