# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

admin_user = User.invite!(firstname: "Paul", lastname: "Gruson", email: "p.gruson@gmail.com")
admin_user.add_role :admin

50.times do |i|
  Post.create({
                title:   "Post #{i}",
                content: "<p><strong>Je suis le post  #{i}</strong></p>",
                structure_id: 554,
                accesses_attributes: [level: 'Pasteur AEM', can_access: true]
              })
end