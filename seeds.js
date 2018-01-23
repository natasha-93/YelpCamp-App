const mongoose  = require('mongoose'),
    Campground  = require('./models/campground'),
    Comment     = require('./models/comment');

let data = [
    {
        name: "Cloud's Rest",
        image: "https://www.campsitephotos.com/photo/camp/68495/feature_Curt_Gowdy_State_Park-f1.jpg",
        price: 18,
        author: Tash,
        description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"
    },
    {
        name: "Desert Mesa",
        image: "https://www.campsitephotos.com/photo/camp/43965/feature_Poinsett_State_Park-f2.jpg",
        author: Tash,
        price: 8,
        description: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat."
    },
    {
        name: "Canyon loor",
        image: "https://www.campsitephotos.com/photo/camp/30093/feature_Island_Acres-f4.jpg",
        author: Tash,
        price: 12,
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    }
]

function seedDB() {
    //Remove all campgrounds
    Campground.remove({}, (err) => {
        if(err){
            console.log(err);
        }
        console.log('removed campgrounds!');
        //add a few campgrounds
        data.forEach((seed) => {
            Campground.create(seed, (err, campground) => {
                if(err){
                    console.log(err);
                } else {
                    console.log('added a campground');
                    Comment.create(  //create a comment
                        {
                            text: 'This place is great but I wish there was internet',
                            author: 'Fred'
                        }, (err, comment) => {
                            if(err){
                                console.log('Couldnt create comment');
                            } else {
                                campground.comments.push(comment._id);
                                campground.save();
                                console.log('created new comment');
                            }
                        }
                    )
                }
            })
        })
    })
}

module.exports = seedDB;
