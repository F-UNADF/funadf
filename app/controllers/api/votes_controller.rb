class Api::VotesController < ApiController

  # GET /votes
  def index
    @campaigns = Campaign.currents

    @user = current_user

    campaing_ids = @user.eligible_campaign_ids

    render json: { campaigns: Campaign.where(id: campaing_ids) }, include: [:structure => { only: :name }]
  end

  def show
    @campaign = Campaign.find params[:id]
    @structure = Structure.find(@campaign.structure_id)
    @user = current_user

    results = @campaign.ballots_for(@user)


    render json: { 
      campaign: @campaign.as_json, 
      structure: @campaign.structure, 
      motions: @campaign.motions.as_json, 
      voters: results.as_json,
      present: true,
    }
  end

  # POST /api/votes { campaign_id, voters: [{resource_id, resource_type, selected}], results: [{motion_id, vote}] }
  # Seuls les bulletins calculés par le serveur pour l'utilisateur (ballots_for) sont acceptés :
  # électeur, droit de vote et caractère consultatif ne viennent jamais du client.
  def create
    motion_ids = Array(params[:results]).map { |vote| vote[:motion_id].to_i }
    campaign   = params[:campaign_id].present? ? Campaign.find(params[:campaign_id]) : Motion.find_by(id: motion_ids.first)&.campaign
    return render json: { status: 'error', error: 'Campaign not found' }, status: :not_found unless campaign
    return render json: { status: 'error', error: 'Campaign is not opened' }, status: :unprocessable_entity unless campaign.opened?

    motions = campaign.motions.index_by(&:id)
    ballots = campaign.ballots_for(current_user)
                      .select { |ballot| !sql_false?(ballot.can_vote) && ballot.has_voted.to_i.zero? }
                      .index_by { |ballot| [ballot.resource_id.to_i, ballot.resource_type.to_s] }

    Array(params[:voters]).each do |voter|
      next unless voter[:selected] == true || voter[:selected].to_s == 'true'

      ballot = ballots[[voter[:resource_id].to_i, voter[:resource_type].to_s]]
      next unless ballot

      Array(params[:results]).each do |vote|
        motion = motions[vote[:motion_id].to_i]
        next unless motion

        exist_voter = Voter.where(motion_id: motion.id, resource_id: ballot.resource_id, resource_type: ballot.resource_type)
        next if exist_voter.exists?

        Voter.create(motion_id: motion.id,
                     voted_at: Time.now,
                     ip: request.remote_ip,
                     resource_id: ballot.resource_id,
                     resource_type: ballot.resource_type)

        ballot_choices(motion, vote[:vote]).each do |choice|
          Vote.create(motion_id: motion.id, result: choice, is_consultative: !sql_false?(ballot.is_consultative))
        end
      end
    end
    render json: { status: 'ok' }
  end

  private

  # Booléen MySQL renvoyé par find_by_sql : 0 / 1, false / true ou NULL.
  def sql_false?(value)
    value == false || value.to_s == '0'
  end

  # Une seule voix par résolution, sauf choix multiple (au plus max_choice choix distincts).
  def ballot_choices(motion, value)
    if motion.kind == 'choices' && value.is_a?(Array)
      value.map(&:to_s).uniq.first([motion.max_choice.to_i, 1].max)
    else
      [value.is_a?(Array) ? value.first : value]
    end
  end
end
