class CreatePoints < ActiveRecord::Migration
  def change
    create_table :points do |t|
      t.references :meppe, index: true
      t.string :name
      t.text :description
      t.float :lat
      t.float :lng

      t.timestamps
    end
  end
end
