class CreateElectors < ActiveRecord::Migration
  class Structure < ActiveRecord::Base
    belongs_to :role, polymorphic: true
  end
  def change
    create_table :electors do |t|
      t.references :resource, polymorphic: true
      t.references :structure, index: true
      t.boolean :can_vote, default: true

      t.timestamps
    end

    Structure.find_each do |structure|
      structure.members.each do |member|
        Elector.create(structure: structure, resource: member)
      end
    end
  end
end
