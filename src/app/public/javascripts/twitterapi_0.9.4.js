/*
 * Copyright (c) 2010 Otchy
 * This source file is subject to the MIT license.
 * http://www.otchy.net
 */
var TwitterAPI = {
version:'0.9.4',
w:window,
d:document,
e:function(id){return this.d.getElementById(id);},
ce:function(el){return this.d.createElement(el);},
ac:function(e){this.d.body.appendChild(e);},
rc:function(e){try{this.d.body.removeChild(e);}catch(e){}},
ae:function(e,t,f){if(e.attachEvent){e.attachEvent('on'+t,f);}else{e.addEventListener(t,f,false);}},
b:'https://twitter.com/',
lout:'https://other:a@twitter.com/',
cnt:0,
tid:function(){return 'TwitterApiID'+(++this.cnt)},
cm:function(c,m,i) {return c+(m&&m.length>0?'/'+m:'')+(i?'/'+i:'');},
isFx:(navigator.userAgent.indexOf('Firefox')>=0),
isIE:(/*@cc_on!@*/false),
isOp:window.opera,
get:function(c,f,p) {
	var t=this;t._get(t.b,c,f,p);
},
_get:function(b,cm,func,param) {
	var t=this;
	var tid=t.tid();
	var s=t.ce('script');
	t.w[tid]=function(obj){
		if(func){func(obj);}
		var t=TwitterAPI;
		setTimeout(function() {
			try{delete t.w[tid];}catch(e){t.w[tid]=null;}
			t.rc(s);
		},100);
	};
	s.src=b+cm+'.json?callback='+tid+((param)?'&'+param:'');
	t.ac(s);
},
post:function(cm,func,vals) {
	var t=this;
	var i1=t.ce('iframe');
	i1.style.display='none';
	t.ac(i1);
	var tid;
	if(t.isIE){
		tid='_self';
		setTimeout(function() {
			t.rc(i1);
		},5000);
	}else{
		tid=t.tid();
		var i2=t.ce('iframe');
		i2.name=tid;
		i2.style.display='none';
		t.ac(i2);
		if(t.isFx){t.w[tid+'flg']=true};
		t.ae(i2.contentWindow,'unload',function(){
			var t=TwitterAPI;
			if(t.w[tid+'flg']){delete t.w[tid+'flg'];return;}
			if(func){func();}
			setTimeout(function() {
				t.rc(i1);
				t.rc(i2);
			},100);
		});
	}
	var d=i1.contentWindow.document;
	d.open();
	d.write('<form method="POST" action="'+t.b+cm+'.xml" target="'+tid+'">');
	if (vals) {
		for(var n in vals) {
			var val=vals[n].replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
			d.write('<input type="hidden" name="'+n+'" value="'+val+'">');
		}
	}
	d.write('</form>');
	d.write('<script>window.onload=function(){document.forms[0].submit();}</script>');
	d.close();
},
relogin:function(f) {
	var t=this;
	var e=false;
	if(t.isOp){
		e=true;
	}else{
		try{t._get(t.lout,t.cm('statuses','user_timeline'),f);}catch(e){e=true;}
	}
	if(e){alert('Not supported relogin.');}
},
search:function(f,i,p){var t=TwitterAPI;t.get(t.cm('search'),f,p);},
statuses:{
	public_timeline:function(f,i,p){var t=TwitterAPI;t.get(t.cm('statuses','public_timeline'),f,p);},
	friends_timeline:function(f,i,p){var t=TwitterAPI;t.get(t.cm('statuses','friends_timeline',i),f,p);},
	user_timeline:function(f,i,p){var t=TwitterAPI;t.get(t.cm('statuses','user_timeline',i),f,p);},
	show:function(f,i,p){var t=TwitterAPI;t.get(t.cm('statuses','show',i),f,p);},
	update:function(s,f) {var t=TwitterAPI;t.post(t.cm('statuses','update'),f,{'status':s});},
	mentions:function(f,i,p){var t=TwitterAPI;t.get(t.cm('statuses','mentions'),f,p);},
	destroy:function(f,i,p){var t=TwitterAPI;t.get(t.cm('statuses','destroy',i),f);},
	friends:function(f,i,p){var t=TwitterAPI;t.get(t.cm('statuses','friends',i),f,p);},
	followers:function(f,i,p){var t=TwitterAPI;t.get(t.cm('statuses','followers',i),f,p);},
	featured:function(f,i,p){var t=TwitterAPI;t.get(t.cm('statuses','featured'),f);}
},
users:{
	show:function(f,i,p){var t=TwitterAPI;t.get(t.cm('users','show',i),f,p);},
	own:function(f) {
		TwitterAPI.statuses.user_timeline(function(r) {
			if (r&&r.length&&r.length>0) {f(r[0].user);}
		},null,'count=1');
	}
},
direct_messages:{
	show:function(f,i,p){var t=TwitterAPI;t.get(t.cm('direct_messages'),f,p);},
	sent:function(f,i,p){var t=TwitterAPI;t.get(t.cm('direct_messages','sent'),f,p);},
	create:function(u,x,f) {var t=TwitterAPI;t.post(t.cm('direct_messages','new'),f,{'user':u,'text':x});},
	destroy:function(f,i,p){var t=TwitterAPI;t.get(t.cm('direct_messages','destroy',i),f,p);}
},
friendships:{
	create:function(f,i,p){var t=TwitterAPI;t.post(t.cm('friendships','create',i),f,p);},
	destroy:function(f,i,p){var t=TwitterAPI;t.post(t.cm('friendships','destroy',i),f,p);},
	exists:function(f,i,p){var t=TwitterAPI;t.get(t.cm('friendships','exists'),f,p);},
	show:function(f,i,p){var t=TwitterAPI;t.get(t.cm('friendships','show'),f,p);}
},
friends:{
	ids:function(f,i,p){var t=TwitterAPI;t.get(t.cm('friends','ids'),f,p);}
},
followers:{
	ids:function(f,i,p){var t=TwitterAPI;t.get(t.cm('followers','ids'),f,p);}
},
account:{
	verify_credentials:function(f,i,p){var t=TwitterAPI;t.get(t.cm('account','verify_credentials'),f);},
	rate_limit_status:function(f,i,p){var t=TwitterAPI;t.get(t.cm('account','rate_limit_status'),f);},
	end_session:function(f,i,p){var t=TwitterAPI;t.get(t.cm('account','end_session'),f);},
	update_delivery_device:function(f,i,p){var t=TwitterAPI;t.get(t.cm('account','update_delivery_device'),f,p);},
	update_profile_colors:function(f,i,p){var t=TwitterAPI;t.post(t.cm('account','update_profile_colors',i),f,p);},
	update_profile_image:function(f,i,p){var t=TwitterAPI;t.post(t.cm('account','update_profile_image',i),f,p);},
	update_profile_background_image:function(f,i,p){var t=TwitterAPI;t.post(t.cm('account','update_profile_background_image',i),f,p);},
	update_profile:function(f,i,p){var t=TwitterAPI;t.post(t.cm('account','update_profile',i),f,p);}
},
favorites:{
	show:function(f,i,p){var t=TwitterAPI;t.get(t.cm('favorites','',i),f,p);},
	create:function(f,i,p){var t=TwitterAPI;t.post(t.cm('favorites','create',i),f,p);},
	destroy:function(f,i,p){var t=TwitterAPI;t.post(t.cm('favorites','destroy',i),f,p);}
},
notifications:{
	follow:function(f,i,p){var t=TwitterAPI;t.get(t.cm('notifications','follow',i));},
	leave:function(f,i,p){var t=TwitterAPI;t.get(t.cm('notifications','leave',i));}
},
blocks:{
	create:function(f,i,p){var t=TwitterAPI;t.post(t.cm('blocks','create',i),f,p);},
	destroy:function(f,i,p){var t=TwitterAPI;t.post(t.cm('blocks','destroy',i),f,p);},
	exists:function(f,i,p){var t=TwitterAPI;t.get(t.cm('blocks','exists',i),f,p);},
	blocking:{
		show:function(f,i,p){var t=TwitterAPI;t.get(t.cm('blocks','blocking',i),f,p);},
		ids:function(f,i,p){var t=TwitterAPI;t.get(t.cm('blocks','blocking','ids'),f,p);}
	}
},
help:{
	test:function(f,i,p){var t=TwitterAPI;t.get(t.cm('help','test'));},
	downtime_schedule:function(f,i,p){var t=TwitterAPI;t.get(t.cm('help','downtime_schedule'));}
}
}