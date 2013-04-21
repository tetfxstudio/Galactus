function solarSystem() {

  space_width = 640;
  space_height = 480;

  // some of this from 
  // http://www.emanueleferonato.com/2012/12/03/introducing-box2dweb-create-box2d-projects-in-html5/
  // http://www.emanueleferonato.com/2012/03/28/simulate-radial-gravity-also-know-as-planet-gravity-with-box2d-as-seen-on-angry-birds-space/

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
  var massless_bodies = [];
  var canvasPosition = getElementPosition(document.getElementById("space"));

  // a sun and/or suns
  function createGravity(radius,mass,pX,pY,type) {

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

  // planets (are relatively massless)
  function createMassless(pX,pY,type) {

    var radius = 1;

    var bodyDef = new b2BodyDef;
    bodyDef.type = type;
    bodyDef.position.Set(pX/worldScale,pY/worldScale);

    var circleShape = new b2CircleShape(radius);

    var fixtureDef = new b2FixtureDef;
    fixtureDef.density = 1/(radius * (3.1415 ^ 2));
    fixtureDef.friction = 1;
    fixtureDef.restitution = 0;
    fixtureDef.shape = circleShape;

    var body=world.CreateBody(bodyDef);
    body.CreateFixture(fixtureDef);
    massless_bodies.push(body)
  }
  
  debugDraw();            
  window.setInterval(update,600/60);
  
  // the SUN
  createGravity(1,Math.random()*40+40,space_width/2,space_height/2,b2Body.b2_staticBody);

  function createPlanet(start_x,start_y,force_x,force_y) {
    createMassless(
      canvasPosition.x + start_x,
      canvasPosition.y + start_y,
      b2Body.b2_dynamicBody
      );

    massless_bodies[massless_bodies.length].ApplyForce(
      new b2Vec2(force_x,force_y),
      massless_bodies.length[massless_bodies.length].GetWorldCenter()
      );
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
    world.Step(6000,10,10);
    world.ClearForces();
    for (var i = 0; i < massless_bodies.length; i++) {
      var massless_pos = massless_bodies[i].GetWorldCenter();
      for (var j = 0; j < gravity_bodies.length; j++) {

        // treat radius as linear in mass
        var gravity_body_radius = gravity_bodies[j].GetFixtureList().GetShape().GetRadius();
        var gravity_body_pos = gravity_bodies[j].GetWorldCenter();

        var gravity_body_distance_vec = new b2Vec2(0,0);
        gravity_body_distance_vec.Add(massless_pos);
        gravity_body_distance_vec.Subtract(gravity_body_pos);
        var gravity_body_distance = gravity_body_distance_vec.Length();

        gravity_vec = gravity_body_distance_vec.GetNegative(); 
        gravity_magnitude = 0.00000001 * gravity_body_radius / ((gravity_body_distance) ^ 2);

        gravity_vec.Multiply(gravity_magnitude);
        
        massless_bodies[i].ApplyForce(gravity_vec,massless_bodies[i].GetWorldCenter());
      }
    }
    world.DrawDebugData();
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

