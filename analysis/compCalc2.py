from __future__ import absolute_import
import pandas as pd
from six.moves import range

def calculate_growth(initial_balance, annual_contribution, annual_return_rate, years, contribution_increase=0):
    data = []
    for year in range(1, years + 1):
        previous_balance = initial_balance
        end_of_year_balance = previous_balance + annual_contribution
        return_amount = end_of_year_balance * annual_return_rate
        end_of_year_balance += return_amount
        data.append([year, previous_balance, annual_contribution, return_amount, end_of_year_balance])
        initial_balance = end_of_year_balance
        annual_contribution += contribution_increase

    df = pd.DataFrame(data, columns=["Year", "Previous Balance ($)", "Annual Contribution ($)", "Return ($)", "End of Year Balance ($)"])
    df["Previous Balance ($)"] = df["Previous Balance ($)"].apply(lambda x: f"{int(round(x)):,}")
    df["Annual Contribution ($)"] = df["Annual Contribution ($)"].apply(lambda x: f"{int(round(x)):,}")
    df["Return ($)"] = df["Return ($)"].apply(lambda x: f"{int(round(x)):,}")
    df["End of Year Balance ($)"] = df["End of Year Balance ($)"].apply(lambda x: f"{int(round(x)):,}")
    df["Monthly Contribution ($)"] = (df["Annual Contribution ($)"].str.replace(',', '').astype(int) / 12).apply(lambda x: f"{int(round(x)):,}")
    return df

def calculate_roth_ira(initial_balance, annual_contribution, annual_return_rate, years):
    return calculate_growth(initial_balance, annual_contribution, annual_return_rate, years)

def calculate_401k(initial_balance, annual_contribution, annual_return_rate, years):
    return calculate_growth(initial_balance, annual_contribution, annual_return_rate, years)

def calculate_brokerage(initial_balance, annual_contribution, annual_return_rate, years, contribution_increase):
    return calculate_growth(initial_balance, annual_contribution, annual_return_rate, years, contribution_increase)

# Parameters for Roth IRA calculation
initial_balance_roth_ira = 0
annual_contribution_roth_ira = 7000
annual_return_rate_roth_ira = 0.16
years_roth_ira = 65 - 27

# Calculate Roth IRA growth
df_roth_ira = calculate_roth_ira(initial_balance_roth_ira, annual_contribution_roth_ira, annual_return_rate_roth_ira, years_roth_ira)

# Parameters for 401k calculation
initial_balance_401k = 0
annual_contribution_401k = 23000
annual_return_rate_401k = 0.23
years_401k = 65 - 27

# Calculate 401k growth
df_401k = calculate_401k(initial_balance_401k, annual_contribution_401k, annual_return_rate_401k, years_401k)

# Parameters for Brokerage account calculation
initial_balance_brokerage = 1000
annual_contribution_brokerage = 50000
annual_return_rate_brokerage = 0.18
contribution_increase_brokerage = 6000
years_brokerage = 65 - 27

# Calculate Brokerage account growth
df_brokerage = calculate_brokerage(initial_balance_brokerage, annual_contribution_brokerage, annual_return_rate_brokerage, years_brokerage, contribution_increase_brokerage)

# Display the dataframes
print("Roth IRA Growth:\n")
print(df_roth_ira.to_string(index=False))

print("\n401k Growth:\n")
print(df_401k.to_string(index=False))

print("\nBrokerage Account Growth:\n")
print(df_brokerage.to_string(index=False))

# Summary table
summary_data = {
    "Year": range(27, 27 + years_401k),
    "Roth IRA Balance ($)": df_roth_ira["End of Year Balance ($)"].str.replace(',', '').astype(int),
    "401k Balance ($)": df_401k["End of Year Balance ($)"].str.replace(',', '').astype(int),
    "Brokerage Account Balance ($)": df_brokerage["End of Year Balance ($)"].str.replace(',', '').astype(int),
    "Annual Contributions ($)": df_roth_ira["Annual Contribution ($)"].str.replace(',', '').astype(int) + df_401k["Annual Contribution ($)"].str.replace(',', '').astype(int) + df_brokerage["Annual Contribution ($)"].str.replace(',', '').astype(int),
    "Monthly Contributions ($)": (df_roth_ira["Annual Contribution ($)"].str.replace(',', '').astype(int) / 12) + (df_401k["Annual Contribution ($)"].str.replace(',', '').astype(int) / 12) + (df_brokerage["Annual Contribution ($)"].str.replace(',', '').astype(int) / 12)
}
summary_data["Total Balance ($)"] = summary_data["Roth IRA Balance ($)"] + summary_data["401k Balance ($)"] + summary_data["Brokerage Account Balance ($)"]

# Creating summary dataframe
df_summary = pd.DataFrame(summary_data)

# Format numbers to be human-readable integers with commas
df_summary["Roth IRA Balance ($)"] = df_summary["Roth IRA Balance ($)"].apply(lambda x: f"{int(round(x)):,}")
df_summary["401k Balance ($)"] = df_summary["401k Balance ($)"].apply(lambda x: f"{int(round(x)):,}")
df_summary["Brokerage Account Balance ($)"] = df_summary["Brokerage Account Balance ($)"].apply(lambda x: f"{int(round(x)):,}")
df_summary["Annual Contributions ($)"] = df_summary["Annual Contributions ($)"].apply(lambda x: f"{int(round(x)):,}")
df_summary["Monthly Contributions ($)"] = df_summary["Monthly Contributions ($)"].apply(lambda x: f"{int(round(x)):,}")
df_summary["Total Balance ($)"] = df_summary["Total Balance ($)"].apply(lambda x: f"{int(round(x)):,}")

print("\nSummary of All Accounts:\n")
print(df_summary.to_string(index=False))
