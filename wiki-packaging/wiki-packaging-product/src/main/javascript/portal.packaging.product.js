eXo.require("eXo.projects.Module") ;
eXo.require("eXo.projects.Product") ;

function getProduct(version) {
  var product = new Product();
  
  product.name = "eXoPortal" ;
  product.portalwar = "portal.war" ;
  product.codeRepo = "portal" ;//module in modules/portal/module.js
  product.serverPluginVersion = "${org.exoplatform.portal.version}"; // CHANGED for Wiki to match portal version. It was ${project.version}

  var kernel = Module.GetModule("kernel") ;
  var core = Module.GetModule("core") ;
  var ws = Module.GetModule("ws", {kernel : kernel, core : core});
  var eXoJcr = Module.GetModule("jcr", {kernel : kernel, core : core, ws : ws}) ;
  var portal = Module.GetModule("portal", {kernel : kernel, ws:ws, core : core, eXoJcr : eXoJcr});
  var wiki = Module.GetModule("wiki", {portal:portal, ws:ws});
  
  product.addDependencies(portal.portlet.exoadmin) ;
  product.addDependencies(portal.portlet.web) ;
  product.addDependencies(portal.portlet.dashboard) ;
  product.addDependencies(portal.eXoGadgetServer) ;
  product.addDependencies(portal.eXoGadgets) ;
  product.addDependencies(portal.webui.portal);
  
  product.addDependencies(portal.web.eXoResources);

  product.addDependencies(portal.web.portal);
  
  // Portal extension starter required by wiki etension
  portal.starter = new Project("org.exoplatform.portal", "exo.portal.starter.war", "war", portal.version);
  portal.starter.deployName = "starter";
  //product.addDependencies(portal.starter);
  
  product.addDependencies(wiki.webuiExt);
   
  // KS extension
  //product.addDependencies(wiki.upgrade);
  product.addDependencies(wiki.rendering);
  product.addDependencies(wiki.wiki);
  product.addDependencies(wiki.extension.webapp);
  product.addDependencies(wiki.commons.extension);

  // KS demo
  product.addDependencies(wiki.demo.portal);
  product.addDependencies(wiki.demo.rest);
  
  product.addDependencies(new Project("org.exoplatform.commons", "exo.platform.commons.component", "jar", "${org.exoplatform.commons.version}"));
  
  product.addServerPatch("tomcat", wiki.server.tomcat.patch) ;
  //product.addServerPatch("jboss",  ks.server.jboss.patch) ;
  product.addServerPatch("jbossear",  wiki.server.jboss.patchear) ;

  /* cleanup duplicated lib */
  product.removeDependency(new Project("commons-httpclient", "commons-httpclient", "jar", "3.0"));
  product.removeDependency(new Project("commons-collections", "commons-collections", "jar", "3.1"));
  product.removeDependency(new Project("commons-collections", "commons-collections", "jar", "3.2"));
  product.removeDependency(new Project("commons-lang", "commons-lang", "jar", "2.3")); // exclusion added by KS. lib dir un tomcat contains versions 2.3 and 2.4. Keeping the newest.
  product.removeDependency(new Project("org.apache.poi", "poi", "jar", "3.0.2-FINAL"));
  product.removeDependency(new Project("org.apache.poi", "poi-scratchpad", "jar", "3.0.2-FINAL"));

  product.module = wiki ;
  product.dependencyModule = [ kernel, core, ws, eXoJcr];

  return product ;
}