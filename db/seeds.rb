# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)


admin_user = User.create(firstname: "Paul", lastname: "Gruson", email: "p.gruson@gmail.com", password: "p@ssw0rd", password_confirmation: "p@ssw0rd")
role = Role.create(name: "Admin", resource: "User")
