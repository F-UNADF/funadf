class Api::ReferentielsController < ApiController

  def show
    referentiel = params[:referentiel]

    ## UTILS ##
    levels = User.get_levels

    result = {}
    case referentiel
    when 'users'
      whatfees                  = Fee.pluck(:what).uniq
      churches                  = Church.select('id AS id, CONCAT(name, "(", town, ")") AS name').order(:name)
      associations              = Association.select('id AS id, name AS name').order(:name)
      functions                 = User.get_functions
      responsabilities          = User.get_responsabilities
      result[:levels]           = levels
      result[:whatFees]         = whatfees
      result[:churches]         = churches
      result[:functions]        = functions
      result[:responsabilities] = responsabilities
      result[:associations]     = associations
    when 'churches'
      roles = I18n.t('activerecord.attributes.roles.names')

      sql     = "
            SELECT
              s.id AS member_id,
              'Structure' AS member_type,
              CONCAT(s.name, ' (', s.town, ')') AS name
            FROM structures s
            UNION
            SELECT
              u.id AS member_id,
              'User' AS member_type,
              CONCAT(u.lastname, ' ', u.firstname) AS name
            FROM users u
            "
      members = ActiveRecord::Base.connection.exec_query(sql).to_a

      result[:roles]   = roles
      result[:members] = members
    when 'associations'
      roles = I18n.t('activerecord.attributes.roles.names')

      sql     = "
            SELECT
              s.id AS member_id,
              'Structure' AS member_type,
              CONCAT(s.name, ' (', s.town, ')') AS name
            FROM structures s
            UNION
            SELECT
              u.id AS member_id,
              'User' AS member_type,
              CONCAT(u.lastname, ' ', u.firstname) AS name
            FROM users u
            "
      members = ActiveRecord::Base.connection.exec_query(sql).to_a

      result[:roles]   = roles
      result[:members] = members
    when 'campaigns'
      structures = Association.select('id AS id, name AS name').order(:name)
      positions  = User.get_levels + %w[Oeuvres Eglises]

      result[:structures] = structures
      result[:positions]  = positions
    when 'events'
      if @intranet
        categories = @intranet.structure.categories
      else
        categories = Category.all
      end
      result[:categories] = categories
      result[:levels]     = levels
    else
      result[:error] = "Invalid referentiel #{referentiel}"
    end

    render json: result
  end
end
