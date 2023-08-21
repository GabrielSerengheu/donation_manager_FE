import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit{

  private apiUrl = 'http://localhost:8080';

  private isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.isAuthenticated());

  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  public username = '';
  constructor(private http: HttpClient) {
  }

  isAuthenticated(): boolean {
    const accessToken = this.getAccessToken();
    return !!accessToken;
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + "/auth/login", credentials, { withCredentials: true })
      .pipe(
        tap((response: any) => {
          if (response.message == "Password change required") {
            window.location.href = '/change-password';
          } else {
            this.isLoggedInSubject.next(true);
          }
        })
      );
  }

  getCurrentUserUsername(): string | null {
    try {
      const accessToken = this.getAccessToken();
      if (!accessToken) {
        console.log('Access token is missing.');
        return null;
      }

      const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
      const userId = tokenPayload.sub; // Extract the user ID from the 'sub' field

      return userId;
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  }

  logout(): Observable<any> {
    const token = this.getAccessToken();
    // const username = this.username;

    const headers = {
      Authorization: `Bearer ${token}`
    };

    this.isLoggedInSubject.next(false);

    return this.http.post(`${this.apiUrl}/auth/logout`, {  }, { headers, responseType: 'text' });
  }

  getUsernameFromToken(token: string): Observable<string> {
    const url = `${this.apiUrl}/auth/get-username?token=${token}`;
    return this.http.get<string>(url);
  }

  saveAccessToken(accessToken: string): void {
    sessionStorage.setItem('accessToken', accessToken);
  }

  getAccessToken(): string | null {
    const token = sessionStorage.getItem('accessToken');
    return token ? token.trim() : null;
  }

  // Clear the accessToken from localStorage on logout
  clearAccessToken(): void {
    sessionStorage.removeItem('accessToken');
  }

  changePassword(userId: number, newPassword: string): Observable<any> {
    const url = `${this.apiUrl}/auth/change-password`;
    const requestBody = { userId, newPassword };

    return this.http.post(url, requestBody);
  }

  updateUserLoginCount(userId: number, newLoginCount: number): Observable<any> {
    const url = `${this.apiUrl}/auth/update-login-count`; // Replace with your actual endpoint
    const params = { userId: userId.toString(), newLoginCount: newLoginCount.toString() };

    return this.http.put(url, null, { params });
  }

  ngOnInit(): void {
    const token = this.getAccessToken(); // Get the token from your authentication service
    if (token) {
      this.getUsernameFromToken(token).subscribe(
        (username: string) => {
          this.username = username;
        },
        (error) => {
          console.error('Error fetching username:', error);
        }
      );
    }
  }
}
