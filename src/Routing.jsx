// routes.jsx
import AllServices from "./pages/AllServices";
import ServiceDetail from "./pages/ServiceDetail";
import SlotSelection from "./pages/SlotSelection";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Bookings";
import App from "./App";
import MenuListing from "./pages/MenuLising";
import Home from "./pages/Home";
import Bookings from "./pages/Bookings";
import Account from "./pages/Accounts";
import MenuDetails from "./pages/ViewMenu";

const routes = [
  {
    path: '/',
    component: App,
    children: [
      { path: '/', component: Home },
      { path: '/services', component: AllServices },
      { path: '/service/:id', component: ServiceDetail },
      { path: '/service/:id/menu', component: MenuListing },
      { path: '/service/:id/menu/details/:id', component: MenuDetails },
      { path: '/service/slots', component: SlotSelection },
      { path: '/cart', component: Cart },
      { path: '/checkout', component: Checkout },
      { path: '/bookings', component: Bookings },
      { path: '/account', component: Account },
    ]
  }
];

export default routes;
