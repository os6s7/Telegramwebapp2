import { useTelegram } from './hooks/useTelegram';
import { Route, Switch } from 'wouter';
import Home from './pages/Home';
import Auth from './pages/Auth';

function App() {
  const { webApp, user } = useTelegram();

  return (
    <div style={{
      backgroundColor: webApp?.themeParams.bg_color || '#ffffff',
      color: webApp?.themeParams.text_color || '#000000',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <Switch>
        <Route path="/" component={user ? Home : Auth} />
      </Switch>
    </div>
  );
}

export default App;