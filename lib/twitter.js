 /*
 * Author:          Sean Nicholls
 * Website:         http://www.seannicholls.com
 * github:          https://github.com/snicholls
 * Twitter:         @sean_nicholls
 *
 * Assumptions:     You need help.
 *
 *
 * Notes:           This file contains helper functions & resources
 *                  that build upon the core Twitter object/library
 *                  by making it more developer-friendly.
 *
 *                  if you are super strict about memory footprint
 *                  you can un-require this file and enter the end
 *                  -points manually.
 *
 *                  do so at your own risk.
 *
 */
var Twitter = require('./core'),
    util = require('./util');

    
module.exports = Twitter;

//
// this is a helper class:
//
// use paths on your own if you like,
// but this avoids typos & helps avoid
// having to rewrite your application
// if the twitter API changes.
//
// this does not follow the API's
// documentation sorting exactly. For 
// example: retweets are treated as 
// their own logical object.
//
// it is also arguably easier to read.
//

Twitter.prototype.resources =   {

    // timeline
    timeline:               {
                                home:   ['statuses/home_timeline', 'GET'],      
                                public: ['statuses/public_timeline', 'GET'],    
                                user:   ['statuses/user_timeline', 'GET']
                                
                            },
    
    statuses:               {
                                create:     {
                                                standard:       ['statuses/update', 'POST'],    
                                                withMedia:      ['statuses/update_with_media', 'POST'],
                                            },
                                        
                                show:       ['statuses/show', 'GET'],   
                                destroy:    ['statuses/destroy', 'POST'],   
                                
                            },
                            
    retweets:               {
                                create:     ['statuses/retweet', 'POST'],   
                                show:       ['statuses/show', 'GET'],
                                
                                timeline:   {
                                                all:        ['statuses/retweets', 'GET'],
                                                    
                                                by_me:      ['statuses/retweeted_by_me', 'GET'],
                                                to_me:      ['statuses/retweeted_to_me', 'GET'],
                                                of_me:      ['statuses/retweets_of_me', 'GET'],
    
                                                to_user:    ['statuses/retweeted_to_user', 'GET'],
                                                by_user:    ['statuses/retweeted_by_user', 'GET']
                                                
                                            },
                                            
                                statuses:   {
                                                by_user:        [   
                                                                    'statuses/',
                                                                    { id: '' },
                                                                    '/retweeted_by',
                                                                    'GET'
                                                                ],
                                                                
                                                by_user_ids:    [   
                                                                    'statuses/',
                                                                    { id: '' },
                                                                    '/retweeted_by/ids',
                                                                    'GET'
                                                                ],
                                                                
                                                list:           ['statuses/retweets/', 'GET']
                                            },
                                            
                                destroy:    ['statuses/destroy', 'POST'],   
                                
                            },
                            
    oembed:                 ['statuses/oembed', 'GET'],
    
    search:                 ['search', 'GET'],
    
    direct_messages:        {
                                create:     ['direct_messages/new', 'POST'],    
                                show:       ['direct_messages/show', 'GET'],
                                
                                recieved:   ['direct_messages', 'GET'],
                                sent:       ['direct_messages/sent', 'GET'],
                                
                                destroy:    ['direct_messages/destroy', 'POST']
                                
                            },  
                            
    followers:              ['followers', 'GET'],
                            
    friendships:            {
                                list:       ['friends', 'GET'],
                                exists:     ['friendships/exists', 'GET'],
                                incoming:   ['friendships/incoming', 'GET'],
                                outgoing:   ['friendships/outgoing', 'GET'],
                                show:       ['friendships/show', 'GET'],
                                create:     ['friendships/create', 'GET'],
                                destroy:    ['friendships/destroy', 'GET'],
                                lookup:     ['friendships/lookup', 'GET'],
                                update:     ['friendships/update', 'GET'],
                            },  
    
    users:                  {
                                lookup:             ['users/lookup', 'GET'],
                                profile_image:      ['users/profile_image', 'GET'],
                                search:             ['users/search', 'GET'],
                                show:               ['users/show', 'GET'],
                                contributees:       ['users/contributees', 'GET'],
                                contributors:       ['users/contributors', 'GET'],
                                
                                timeline:           ['statuses/user_timeline', 'GET']
                            },
                            
    favourites:             {
                                list:               ['favourites', 'GET'],
                                create:             ['favourites/create', 'GET'],
                                destroy:            ['favourites/destroy', 'GET'] 
                            },
                            
    lists:                  {
                                list:           {
                                                    all:            ['lists/all', 'GET'],
                                                    statuses:       ['lists/statuses', 'GET'],
                                                    memberships:    ['lists/memberships', 'GET'],
                                                    user:           ['lists', 'GET']
                                                },
                                                
                                destroy:        ['lists/destroy', 'POST'],
                                
                                subscribers:    {
                                                    list:       ['lists/subscribers', 'GET'],
                                                    create:     {
                                                                    one:    ['lists/subscribers/create', 'POST'],
                                                                    many:   ['lists/subscribers/create_all', 'POST']
                                                                },
                                                    show:       ['lists/subscribers/show', 'GET'],
                                                    destroy:    ['lists/subscribers/destroy', 'POST'],
                                                },
                                                
                                members:        {
                                                    create:     {
                                                                    one:    ['lists/members/create', 'POST'],
                                                                    many:   ['lists/members/create_all', 'POST']
                                                                },
                                                    show:       ['lists/members/show', 'GET'],
                                                    list:       ['lists/members', 'GET'],
                                                    destroy:    {
                                                                    many:   ['lists/members/destroy_all', 'POST']
                                                                }
                                                },
                                                
                                create:         ['lists/create', 'POST'],
                                update:         ['lists/update', 'POST'],
                                
                                show:           ['lists/show', 'GET'],
                                
                                subscriptions:  ['lists/subscriptions', 'GET'],
                                
                                
                            },
                            
    account:                {
                                rate_limit_status:      ['account/rate_limit_status', 'GET'],
                                verify_credentials:     ['account/verify_credentials', 'GET'],
                                
                                end_session:            ['account/end_session', 'GET'],
                                
                                profile:                {
                                                            update:     {
                                                                            now:                ['account/update_profile', 'POST'],
                                                                            background_image:   ['account/update_profile_background_image', 'POST'],
                                                                            colors:             ['account/update_profile_colors', 'POST'],
                                                                            image:              ['account/update_profile_image', 'POST']
                                                                        }
                                                        },
                                                        
                                totals:                 ['account/totals', 'GET'],
                                
                                settings:               {
                                                            show:   ['account/settings', 'GET'],
                                                            update: ['account/settings', 'POST']
                                                        }
                                
                            },
                            
    notifications:          {
                                follow:                 ['notifications/follow', 'POST'],
                                leave:                  ['notifications/leave', 'POST']
                            },
    
    saved_searches:         {
                                list:                   ['saved_searches', 'GET'],
                                show:                   ['saved_searches/show', 'GET'],
                                create:                 ['saved_searches/create', 'POST'],
                                destroy:                ['saved_searches/destroy', 'POST']
                            },
                            
    geo:                    {
                                show:                   ['geo', 'GET'],
                                reverse_geocode:        ['geo/reverse_geocode', 'GET'],
                                search:                 ['geo/search', 'GET'],
                                similar_places:         ['geo/similar_places', 'GET'],
                                create:                 ['geo/place', 'POST']
                            },
                            
    trends:                 {
                                list:                   ['trends', 'GET'],
                                available:              ['trends/available', 'GET'],
                                daily:                  ['trends/daily', 'GET'],
                                weekly:                 ['trends/weekly', 'GET']
                            },
                            
    block:                  {
                                list:                   {
                                                             users:     ['blocks/blocking', 'GET'],
                                                             ids:       ['blocks/blocking/ids', 'GET'],
                                                        },
                                exists:                 ['blocks/exists', 'GET'],
                                create:                 ['blocks/create', 'POST'],
                                destroy:                ['blocks/destroy', 'POST']
                            },
                            
    spam:                   {
                                report:                 ['report_spam', 'POST']
                            },
                            
    oauth:                  {
                                authenticate:           ['oauth/authenticate', 'GET'],
                                authorize:              ['oauth/authorize', 'GET'],
                                
                                access_token:           ['oauth/access_token', 'POST'],
                                request_token:          ['oauth/request_token', 'POST']
                            },
                            
    help:                   {
                                test:                   ['help/test', 'GET'],
                                configuration:          ['help/configuration', 'GET'],
                                languages:              ['help/languages', 'GET']
                            },
                            
    legal:                  {
                                privacy:                ['legal/privacy', 'GET'],
                                tos:                    ['legal/tos', 'GET']
                            },
                            
    stream:                 {
                                statuses:               {
                                                            filter:     ['statuses/filter', 'POST'],        
                                                            sample:     ['statuses/sample', 'GET'], 
                                                            firehose:   ['statuses/firehose', 'GET']    
                                                        },
                                                        
                                user:                   ['user', 'POST'],
                                
                                site:                   ['site', 'POST'],
                                
                            }
                            
    // TODO:    keep up to date with Twitter API changes
    //          plus, magic, gagnam style.
                                
}

//////
TwitterHelper = function(){}

// timeline
TwitterHelper.prototype.Timeline = function(theparent) {

    this.parent =               theparent;

    this.public =               function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.timeline.public,
                                                                param,
                                                                false,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
    
    this.home =                 function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.timeline.home,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
    
    this.user =                 function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.timeline.user,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };

}

// statuses
TwitterHelper.prototype.Statuses = function(theparent) {

    this.parent =               theparent;

    this.create =               new TwitterHelper.prototype.Statuses_create(this.parent);

    this.show =                 function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.statuses.show,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };

    this.destroy =              function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.statuses.destroy,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                    
}
TwitterHelper.prototype.Statuses_create = function(theparent) {
    
    this.parent =               theparent;
    
    this.standard =             function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.statuses.create.standard,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
        
    this.withMedia =            function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.statuses.create.withMedia,
                                                                param,
                                                                true,
                                                                { media: true },
                                                                callback,
                                                                this.parent);
                                };
    
}

// retweets
TwitterHelper.prototype.Retweets = function(theparent) {

    this.parent =               theparent;

    this.create =               function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.retweets.create,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                
    this.show =                 function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.retweets.show,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                
    this.timeline =             new TwitterHelper.prototype.Retweets_timeline(this.parent);

    this.statuses =             new TwitterHelper.prototype.Retweets_statuses(this.parent);

    this.destroy =              function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.retweets.destroy,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                    
}

TwitterHelper.prototype.Retweets_timeline = function(theparent) {

    this.parent =               theparent;
    
    all =                       function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.retweets.timeline.all,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                
    by_me =                     function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.retweets.timeline.by_me,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                
    to_me =                     function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.retweets.timeline.to_me,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                
    of_me =                     function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.retweets.timeline.of_me,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                
    to_user =                   function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.retweets.timeline.to_user,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                
    by_user =                   function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.retweets.timeline.by_user,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
    
}
TwitterHelper.prototype.Retweets_statuses = function(theparent) {

    this.parent =               theparent;
    
    this.by_user =              function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.retweets.statuses.by_user,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                
    this.by_user_ids =          function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.retweets.statuses.by_user_ids,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                
    this.list =                 function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.retweets.statuses.list,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };

}



// oembed
TwitterHelper.prototype.Oembed = function(theparent) {

    this.parent =               theparent;

    this.show =                 function(param, callback, parent) {
                                    return this.parent.request( Twitter.prototype.resources.oembed,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                }

}

// search
TwitterHelper.prototype.Search = function(theparent) {

    this.parent =               theparent;

    this.list =                 function(param, callback, parent) {
                                    return this.parent.request( Twitter.prototype.resources.search,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };

}
                            
// direct messages
TwitterHelper.prototype.DirectMessages = function(theparent) {

    this.parent =               theparent;

    this.create =               function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.direct_messages.create,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                
    this.show =                 function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.direct_messages.show,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                
    this.recieved =             function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.direct_messages.recieved,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                
    this.sent =                 function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.direct_messages.sent,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };

    this.destroy =              function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.direct_messages.destroy,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                    
}

// users
TwitterHelper.prototype.Users = function(theparent) {

    this.parent =               theparent;

    this.lookup =               function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.users.lookup,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                
    this.profile_image =        function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.users.profile_image,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                
    this.search =               function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.users.search,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                
    this.show =                 function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.users.show,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };

    this.contributees =         function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.users.contributees,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };

    this.contributors =         function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.users.contributors,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };

    this.timeline =             function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.users.timeline,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                    
}
                        
// favourites
TwitterHelper.prototype.Favourites = function(theparent) {

    this.parent =               theparent;

    this.list =                 function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.favourites.list,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                
    this.create =               function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.favourites.create,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                
    this.destroy =              function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.favourites.destroy,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };

}

// lists
TwitterHelper.prototype.Lists_list = function(theparent) {

    this.parent =               theparent;
    
    this.all =                  function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.lists.list.all,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                
    this.statuses =             function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.lists.list.statuses,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                
    this.memberships =          function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.lists.list.memberships,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                
    this.users =                function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.lists.list.users,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
    
}
TwitterHelper.prototype.Lists_subscribers = function(theparent) {

    this.parent =               theparent;

    this.list =                 function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.subscribers.list,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                    
    this.create =               new TwitterHelper.prototype.Lists_subscribers_create(this.parent);
                
    this.show =                 function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.subscribers.show,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                    
    this.destroy =              function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.subscribers.destroy,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };

}
TwitterHelper.prototype.Lists_subscribers_create = function(theparent) {

    this.parent =               theparent;
    
    this.one =                  function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.subscribers.create.one,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                
    this.many =                 function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.subscribers.create.many,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };

}
TwitterHelper.prototype.Lists_members_create = function(theparent) {
    
    this.parent =               theparent;
    
    this.one =                  function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.members.create.one,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                
    this.many =                 function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.members.create.many,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
    
}
TwitterHelper.prototype.Lists_members_destroy = function(theparent) {
    
    this.parent =               theparent;
    
    this.many =                 function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.members.destroy.many,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
    
}
TwitterHelper.prototype.Lists_members = function(theparent) {
    
    this.parent =               theparent;
    
    this.list =                 function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.members.list,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };

    this.create =               new TwitterHelper.prototype.Lists_members_create(this.parent);
                    
    this.destroy =              new TwitterHelper.prototype.Lists_members_destroy(this.parent);
                
                    
    this.update =               function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.members.update,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                
    this.show =                 function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.members.show,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };  
                
    this.subscriptions =        function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.members.subscriptions,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
    
}
TwitterHelper.prototype.Lists = function(theparent) {

    this.parent =               theparent;

    this.list =                 new TwitterHelper.prototype.Lists_list(this.parent);

    this.destroy =              function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.lists.destroy,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };

    this.subscribers =          new TwitterHelper.prototype.Lists_subscribers(this.parent);
                    
    this.members =              new TwitterHelper.prototype.Lists_members(this.parent);
                    
}
    
// account
TwitterHelper.prototype.Account_profile = function(theparent) {
    
    this.parent =               theparent;
    
    this.update =               new TwitterHelper.prototype.Account_profile_update(this.parent);
    
}
TwitterHelper.prototype.Account_profile_update = function(theparent) {
    
    this.parent =               theparent;
    
    
    this.now =                  function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.account.profile.update.now,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
            
    this.background_image =     function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.account.profile.update.background_image,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
            
    this.colors =               function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.account.profile.update.colors,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
            
    this.image =                function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.account.profile.update.image,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
    
}
TwitterHelper.prototype.Account_settings = function(theparent) {
    
    this.parent =               theparent;
    
    
    this.show =                 function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.settings.show,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                    
    this.update =               function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.settings.update,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
    
}
TwitterHelper.prototype.Account = function(theparent) {

    this.parent =               theparent;

    this.rate_limit_status =    function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.account.rate_limit_status,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                    
    this.verify_credentials =   function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.account.verify_credentials,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                    
    this.end_session =          function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.account.end_session,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                    
    this.profile =              new TwitterHelper.prototype.Account_profile(this.parent);
                        
    this.totals =               function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.account.totals,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };

    this.settings =             new TwitterHelper.prototype.Account_settings(this.parent);
                    
}
    
// notifications
TwitterHelper.prototype.Notifications =  function(theparent) {

    this.parent =               theparent;

    this.follow =               function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.notifications.follow,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                    
    this.leave =                function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.notifications.leave,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
    
}
    
// saved searches
TwitterHelper.prototype.SavedSearches =  function(theparent) {

    this.parent =               theparent;

    this.list =                 function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.saved_searches.list,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                    
    this.show =                 function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.saved_searches.show,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                    
    this.create =               function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.saved_searches.create,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                    
    this.destroy =              function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.saved_searches.destroy,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
    
}
    
// geo
TwitterHelper.prototype.Geo =  function(theparent) {

    this.parent =               theparent;

    this.show =                 function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.geo.show,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                                
    this.reverse_geocode =      function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.geo.reverse_geocode,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                                
    this.search =               function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.geo.search,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                                
    this.similar_places =       function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.geo.similar_places,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                                
    this.create =               function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.geo.create,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
    
}
    
// trends
TwitterHelper.prototype.Trends =  function(theparent) {

    this.parent =               theparent;

    this.list =                 function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.trends.list,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                                
    this.available =            function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.trends.available,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                                
    this.daily =                function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.trends.daily,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                                
    this.weekly =               function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.trends.weekly,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
    
}

// block
TwitterHelper.prototype.Block =  function(theparent) {

    this.parent =               theparent;

    this.list =                 new TwitterHelper.prototype.Block_list(this.parent);
                                
    this.exists =               function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.block.exists,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                                
    this.create =               function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.block.create,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                                
    this.destroy =              function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.block.destroy,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
    
}
TwitterHelper.prototype.Block_list =  function(theparent) {

    this.parent =               theparent;

    this.users =                function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.block.list.users,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                                
    this.ids =                  function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.block.list.ids,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                                
}
    
// spam
TwitterHelper.prototype.Spam =  function(theparent) {

    this.parent =               theparent;

    this.report =               function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.spam.report,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                                
}

//
// oauth
//
// not used in normal API operation.
// oauth is used for authenticating the current
// user. 
//

// help
TwitterHelper.prototype.Help =  function(theparent) {

    this.parent =               theparent;

    this.test =                 function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.help.test,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };

    this.configuration =        function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.help.configuration,
                                                                param,
                                                                true,
                                                                callback,
                                                                null,
                                                                this.parent);
                                };

    this.languages =            function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.help.languages,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                                
}

// legal
TwitterHelper.prototype.Legal =  function(theparent) {

    this.parent =               theparent;

    this.privacy =              function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.legal.privacy,
                                                                param,
                                                                true,
                                                                callback,
                                                                null,
                                                                this.parent);
                                };

    this.tos =                  function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.legal.tos,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                                
}

// stream
TwitterHelper.prototype.Stream =  function(theparent) {

    this.parent =               theparent;

    this.privacy =              function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.legal.privacy,
                                                                param,
                                                                true,
                                                                callback,
                                                                null,
                                                                this.parent);
                                };

    this.tos =                  function(param, callback) {
                                    return this.parent.request( Twitter.prototype.resources.legal.tos,
                                                                param,
                                                                true,
                                                                null,
                                                                callback,
                                                                this.parent);
                                };
                                
}

// stream
TwitterHelper.prototype.Stream =  function(theparent) {

    this.parent =               theparent;

    this.statuses =             new TwitterHelper.prototype.Stream_statuses(this.parent);
                                
    this.user =                 function(param, callback) {
                                    return this.parent.requestStream(   Twitter.prototype.resources.stream.user,
                                                                        param,
                                                                        true,
                                                                        null,
                                                                        callback,
                                                                        this.parent);
                                }
                                
    this.site =                 function(param, callback) {
                                    return this.parent.requestStream(   Twitter.prototype.resources.stream.site,
                                                                        param,
                                                                        true,
                                                                        null,
                                                                        callback,
                                                                        this.parent);
                                };
    
}
TwitterHelper.prototype.Stream_statuses =  function(theparent) {

    this.parent =               theparent;

    this.filter =               function(param, callback) {
                                    return this.parent.requestStream(   Twitter.prototype.resources.stream.statuses.filter,
                                                                        param,
                                                                        true,
                                                                        null,
                                                                        callback,
                                                                        this.parent);
                                };
                                
    this.sample =               function(param, callback) {
                                    return this.parent.requestStream(   Twitter.prototype.resources.stream.statuses.sample,
                                                                        param,
                                                                        true,
                                                                        null,
                                                                        callback,
                                                                        this.parent);
                                };
                                
    this.firehose =             function(param, callback) {
                                    return this.parent.requestStream(   Twitter.prototype.resources.stream.statuses.firehose,
                                                                        param,
                                                                        true,
                                                                        null,
                                                                        callback,
                                                                        this.parent);
                                };
                                
}

