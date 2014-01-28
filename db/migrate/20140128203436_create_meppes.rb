class CreateMeppes < ActiveRecord::Migration
  def change
    create_table :meppes do |t|
      t.references :category, index: true
      t.string :name
      t.text :description
      t.float :lat
      t.float :lng

      t.timestamps
    end
  end
end
