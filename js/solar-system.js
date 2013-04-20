function solarSystem() {

  space_width = 640;
  space_height = 480;

  // some of this from 
  // http://www.emanueleferonato.com/2012/12/03/introducing-box2dweb-create-box2d-projects-in-html5/

  var b2Vec2 = Box2D.Common.Math.b2Vec2;
  var b2AABB = Box2D.Collision.b2AABB;
  var b2BodyDef = Box2D.Dynamics.b2BodyDef;
  var b2Body = Box2D.Dynamics.b2Body;
  var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
  var b2Fixture = Box2D.Dynamics.b2Fixture;
  var b2World = Box2D.Dynamics.b2World;
  var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
  var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
  var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
  
  var worldScale = 30;
  
  var world = new b2World(new b2Vec2(0, 0),true);
  var gravity_bodies = [];
  var canvasPosition = getElementPosition(document.getElementById("space"));

  function addGravityBody(radius,mass,pX,pY,type) {

    var bodyDef = new b2BodyDef;
    bodyDef.type = type;
    bodyDef.position.Set(pX/worldScale,pY/worldScale);

    var circleShape = new b2CircleShape(radius);

    var fixtureDef = new b2FixtureDef;
    fixtureDef.density = mass/(radius * (3.1415 ^ 2));
    fixtureDef.friction = 1;
    fixtureDef.restitution = 0;
    fixtureDef.shape = circleShape;

    var body=world.CreateBody(bodyDef);
    body.CreateFixture(fixtureDef);
    gravity_bodies.push(body)

  }
  
  debugDraw();            
  window.setInterval(update,1000/60);
  
  createBox(space_width,30,space_width/2,space_height,b2Body.b2_staticBody);
  createBox(space_width,30,space_width/2,0,b2Body.b2_staticBody);
  createBox(30,space_height,0,space_height/2,b2Body.b2_staticBody);
  createBox(30,space_height,space_width,space_height/2,b2Body.b2_staticBody);
  
  document.addEventListener("mousedown",function(e){
    addGravityBody(Math.random()*4+1,Math.random()*40+40,e.clientX-canvasPosition.x,e.clientY-canvasPosition.y,b2Body.b2_dynamicBody);
  });
  
  function createBox(width,height,pX,pY,type){
    var bodyDef = new b2BodyDef;
    bodyDef.type = type;
    bodyDef.position.Set(pX/worldScale,pY/worldScale);
    var polygonShape = new b2PolygonShape;
    polygonShape.SetAsBox(width/2/worldScale,height/2/worldScale);
    var fixtureDef = new b2FixtureDef;
    fixtureDef.density = 1.0;
    fixtureDef.friction = 0.5;
    fixtureDef.restitution = 0.5;
    fixtureDef.shape = polygonShape;
    var body=world.CreateBody(bodyDef);
    body.CreateFixture(fixtureDef);
  }
  
  function debugDraw(){
    var debugDraw = new b2DebugDraw();
    debugDraw.SetSprite(document.getElementById("space").getContext("2d"));
    debugDraw.SetDrawScale(30.0);
    debugDraw.SetFillAlpha(0.5);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
    world.SetDebugDraw(debugDraw);
  }
  
  function update() {
    world.Step(1/60,10,10);
    world.DrawDebugData();
    world.ClearForces();
  };
  
  //http://js-tut.aardon.de/js-tut/tutorial/position.html
  function getElementPosition(element) {
    var elem=element, tagname="", x=0, y=0;
    while((typeof(elem) == "object") && (typeof(elem.tagName) != "undefined")) {
      y += elem.offsetTop;
      x += elem.offsetLeft;
      tagname = elem.tagName.toUpperCase();
      if(tagname == "BODY"){
        elem=0;
      }
      if(typeof(elem) == "object"){
        if(typeof(elem.offsetParent) == "object"){
          elem = elem.offsetParent;
        }
      }
    }
    return {x: x, y: y};
  }

};

