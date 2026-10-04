class CreateJobRuns < ActiveRecord::Migration[6.1]
  def change
    create_table :job_runs do |t|
      t.string :job_name
      t.datetime :ran_at

      t.timestamps
    end
  end
end
