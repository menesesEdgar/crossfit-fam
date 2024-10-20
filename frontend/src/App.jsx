import { Toaster } from 'react-hot-toast';
import AppRouter from './router/AppRouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppProvider from './context/AppProvider';
const queryClient = new QueryClient();

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <AppRouter/>
        <Toaster position='bottom-right'/>
      </AppProvider>
    </QueryClientProvider>
  )
}

export default App
