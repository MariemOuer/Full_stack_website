import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginView from '../views/LoginView';
import DashboardView from '../views/DashboardView';
import SignupView from '../views/SignupView';
import { AuthProvider, useAuth } from '../context/AuthContext';

// Mock the AuthContext and AuthController
jest.mock('../context/AuthContext', () => ({
  ...jest.requireActual('../context/AuthContext'),
  useAuth: jest.fn(),
}));

jest.mock('../controllers/AuthController', () => ({
  useAuthController: () => ({
    loginWithEmail: jest.fn(),
    loginAsGuest: jest.fn(),
  }),
}));

// Mock the navigate function
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Preserve the actual implementation
  useNavigate: () => mockNavigate, // Mock only useNavigate
}));

// Test suite for LoginView
describe('LoginView', () => {
  // Mock the currentUser and setIsGuest
  const mockSetIsGuest = jest.fn();
  const mockLoginWithEmail = jest.fn();
  const mockLoginAsGuest = jest.fn();

  beforeEach(() => {
    useAuth.mockReturnValue({
      currentUser: null,
      setIsGuest: mockSetIsGuest,
    });

    mockLoginWithEmail.mockResolvedValue(true);
    mockLoginAsGuest.mockResolvedValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test Case 1: Successful Login with Valid Credentials
  it('should log in successfully with valid credentials and redirect to dashboard', async () => {
    render(
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginView />} />
            <Route path="/" element={<DashboardView />} />
          </Routes>
        </Router>
      </AuthProvider>
    );

    // Fill in the email and password fields
    fireEvent.change(screen.getByPlaceholderText('Email Address'), {
      target: { value: 'mariemouertatani01@gmail.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: '123456' },
    });

    // Click the login button
    fireEvent.click(screen.getByText('Login'));

    // Wait for the login process to complete
    await waitFor(() => {
      expect(mockLoginWithEmail).toHaveBeenCalledWith('mariemouertatani01@gmail.com', '123456');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  // Test Case 2: Failed Login with Invalid Credentials
  it('should display an error message when login fails', async () => {
    mockLoginWithEmail.mockRejectedValue(new Error('Invalid email or password'));

    render(
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginView />} />
          </Routes>
        </Router>
      </AuthProvider>
    );

    // Fill in the email and password fields
    fireEvent.change(screen.getByPlaceholderText('Email Address'), {
      target: { value: 'invalid@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'wrongpassword' },
    });

    // Click the login button
    fireEvent.click(screen.getByText('Login'));

    // Wait for the error message to be displayed
    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    });
  });

  // Test Case 3: Login as Guest
  it('should log in as a guest and redirect to dashboard', async () => {
    render(
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginView />} />
            <Route path="/" element={<DashboardView />} />
          </Routes>
        </Router>
      </AuthProvider>
    );

    // Click the "Continue as Guest" link
    fireEvent.click(screen.getByText('Continue as Guest'));

    // Wait for the guest login process to complete
    await waitFor(() => {
      expect(mockLoginAsGuest).toHaveBeenCalled();
      expect(mockSetIsGuest).toHaveBeenCalledWith(true);
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  // Test Case 4: Navigation to Signup Page
  it('should navigate to the signup page when the signup button is clicked', () => {
    render(
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginView />} />
            <Route path="/signup" element={<SignupView />} />
          </Routes>
        </Router>
      </AuthProvider>
    );

    // Click the signup button
    fireEvent.click(screen.getByText('Signup'));

    // Verify navigation to the signup page
    expect(screen.getByText('Signup')).toBeInTheDocument();
  });

  // Test Case 5: Redirect to Login Page if Not Authenticated
  it('should redirect to the login page if the user is not authenticated', () => {
    useAuth.mockReturnValue({
      currentUser: null,
    });

    render(
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<DashboardView />} />
            <Route path="/login" element={<LoginView />} />
          </Routes>
        </Router>
      </AuthProvider>
    );

    // Verify redirection to the login page
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});