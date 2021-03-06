import javax.annotation.Resource;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.sql.DataSource;

import com.google.gson.JsonObject;
import java.sql.PreparedStatement;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.*;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@WebServlet(name = "placedOrder", urlPatterns = "/placedOrder")
public class placedOrder extends HttpServlet{
	private static final long serialVersionUID = 1L;
	@Resource(name = "jdbc/master")
	private DataSource dataSource;

	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
		HttpSession session = request.getSession(); // Get a instance of current session on the request
		Map<String, Integer> previousItems = (Map<String, Integer>) session.getAttribute("previousItems");
		

		response.setContentType("text/html");
		PrintWriter out = response.getWriter();
		String title = "order placed";
		DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy/MM/dd");
		LocalDate localDate = LocalDate.now();
		String s = dtf.format(localDate);
		//String s = s1.replaceAll("-", "/");
		String docType = "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.0 Transitional//EN\">\n";
		out.println(String.format(
				"%s<html>\n<head><title>%s</title><link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css\">\r\n"
						+ "\r\n" + "<!-- jQuery library -->\r\n"
						+ "<script src=\"https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js\"></script>\r\n"
						+ "\r\n" + "<!-- Latest compiled JavaScript -->\r\n"
						+ "<script src=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js\"></script> \r\n"
						+ "	</head>\n<body bgcolor=\"#FDF5E6\">\n",
				docType, title, title));

		try {
			out.println("<center><h2>Your order has been placed!</h2></center>");
			// Create a new connection to database
			Connection dbCon = dataSource.getConnection();

			// Declare a new statement

			String customerEmail = (String)((User)session.getAttribute("user")).getUsername();
			String q = String.format(
					"SELECT customers.id, customers.email from customers where customers.email = '%s';", customerEmail);
			PreparedStatement statement = dbCon.prepareStatement(q);
			ResultSet customerProfile = statement.executeQuery();
			
			
			int customerId = 0;
			if(customerProfile.next())
				customerId = customerProfile.getInt("customers.id");
			
			synchronized (previousItems) {
					Iterator it = previousItems.entrySet().iterator();

					out.println("<h3 align = \"center\">order details: </h3><br>");
					while (it.hasNext()) {
						Map.Entry pair = (Map.Entry) it.next();
						String previousItem = (String) pair.getKey();
						Integer count = (Integer) pair.getValue();
						//out.printf("SELECT movies.id, movies.title from movies where movies.id = '%s';", previousItem);
						String query = String.format(
								"SELECT movies.id, movies.title from movies where movies.id = '%s';", previousItem);
						ResultSet rs = statement.executeQuery(query);

					if (rs.next()) {
						String mystr = rs.getString("movies.id");
						String movietitle = rs.getString("movies.title");
						// VALUES(%d,'%s','%s');", customerId, rs.getString("movies.id"),s);
						for (int numItems = 0; numItems < count; numItems++) {
							//out.println("<p>" + customerId + " " + mystr + " " + s + "</p>");
							String ins = String.format(
									"INSERT INTO sales(customerId,movieId,saleDate) VALUES(%d,'%s','%s');", customerId,
									rs.getString("movies.id"), s);
							PreparedStatement bc = dbCon.prepareStatement(ins);
							//int salesid = statement.executeUpdate(ins,Statement.RETURN_GENERATED_KEYS);
							
							bc.executeUpdate(ins,Statement.RETURN_GENERATED_KEYS);
							ResultSet result = bc.getGeneratedKeys();
							if (result.next())
							{
								Long newId = result.getLong(1);
								out.println("<h4 align = \"center\"> sale ID: " + newId + " movie purchased: " + movietitle + "</h4>");
							}
						}
					}
					}
					
					previousItems.clear();
				}
			statement.close();
        	dbCon.close();
			}
		
		 catch (Exception e) {
				out.println(String.format(
						"<html><head><title>MovieDB: Error</title></head>\n<body><p>SQL error in doGet: %s</p></body></html>",
						e.getMessage()));
		}

		out.println("</body></html>");
		out.close();


	}

	public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {

		doGet(request, response);

	}
}