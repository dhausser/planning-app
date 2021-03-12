import { ApolloProvider } from "@apollo/client";
import { useApollo } from "../apollo/client";
// import { useEffect } from "react";
// import {
//   NavigationProvider,
//   withNavigationViewController,
//   LayoutManagerWithViewController,
// } from "@atlaskit/navigation-next";
// import "@atlaskit/css-reset";

// import {
//   MyGlobalNavigation,
//   productHomeView,
//   productIssuesView,
//   projectHomeView,
// } from "../client/src/components/Navigation";

// interface NavigationViewController {
//   navigationViewController: {
//     setView: (name: object) => void;
//     addView: (name: object) => void;
//   };
//   children: JSX.Element;
// }

// function AppRouter({
//   navigationViewController,
//   children,
// }: NavigationViewController) {
//   useEffect(() => {
//     navigationViewController.addView(productHomeView);
//     navigationViewController.addView(productIssuesView);
//     navigationViewController.addView(projectHomeView);
//   }, [navigationViewController]);

//   return (
//     <LayoutManagerWithViewController globalNavigation={MyGlobalNavigation}>
//       {children}
//     </LayoutManagerWithViewController>
//   );
// }

// const AppWithNavigationViewController = withNavigationViewController(AppRouter);

export default function App({ Component, pageProps }) {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={apolloClient}>
      {/* <NavigationProvider>
        <AppWithNavigationViewController> */}
      <Component {...pageProps} />
      {/* </AppWithNavigationViewController>
      </NavigationProvider> */}
    </ApolloProvider>
  );
}
