import React from 'react';

function toggleNavOpenState() {
  // setState({ navOpenState }
}

export const NavContext = React.createContext({
  navOpenState: {
    isOpen: true,
    width: 304,
  },
  onNavResize: () => toggleNavOpenState(),
});
