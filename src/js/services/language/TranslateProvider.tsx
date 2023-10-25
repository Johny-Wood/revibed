import type { PropsWithChildren } from 'react';
import { Component } from 'react';

import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';

import type { RootState } from '@/js/redux/reducers';

import TranslateContext from './TranslateContext';

type PropsFromRedux = ConnectedProps<typeof connector>;

type TranslateProviderProps = PropsWithChildren & PropsFromRedux;

class TranslateProvider extends Component<TranslateProviderProps> {
  constructor(props: TranslateProviderProps | Readonly<TranslateProviderProps>) {
    super(props);

    const { languageSelected: { language } = {} } = props;

    TranslateContext.init(language);
  }

  render() {
    const { children, languageSelected: { language } = {} } = this.props;

    const Context = TranslateContext.get();

    return <Context.Provider value={language}>{children}</Context.Provider>;
  }
}

const connector = connect((state: RootState) => ({
  languageSelected: state.GlobalReducer.languageSelected,
}));

export default connector(TranslateProvider);
