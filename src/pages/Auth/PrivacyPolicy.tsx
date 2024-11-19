import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { globalStyle } from "../../assets/css/globalStyle";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

export default function PrivacyPolicy({ navigation }) {
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerBackVisible: false,
      headerTitle: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ ...globalStyle.alignItemsCenter, gap: 15 }}>
          <FontAwesome name="angle-left" size={28} color="white" />
          <Text style={{ color: "#FFF", fontSize: 24 }}>
            Privacy policy
          </Text>
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: "#040B11",
      },
      headerTintColor: "#FFF",
    });
  }, [navigation]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View>
        <Text style={[styles.caption]}>
          Capiwise GmbH ("us", "we", or "our") operates the website
          capiwisie.com (the “Capiwise Site” or the "Service"). This page
          informs you of our policies regarding the collection, use, and
          disclosure of personal data when you use our Service and the choices
          you have associated with that data.
        </Text>
      </View>
      <Text style={styles.title}>
        Cookies
      </Text>
      <Text style={[styles.caption]}>
        Cookies are small pieces of data stored on a User’s device.
      </Text>
      <Text style={styles.title}>
        Data Controller
      </Text>
      <Text style={[styles.caption]}>
        Data Controller means a person who (either alone or jointly or in common
        with other persons) determines the purposes for which and the manner in
        which any personal data are, or are to be, processed. For the purpose of
        this Privacy Policy, we are a Data Controller of your data.
      </Text>
      <Text style={styles.title}>
        Data Processor (or Service Providers)
      </Text>
      <Text style={[styles.caption]}>
        Data Processor (or Service Provider) means any person (other than an
        employee of the Data Controller) who processes the data on behalf of the
        Data Controller. We may use the services of various Service Providers in
        order to process your data more effectively.
      </Text>
      <Text style={styles.title}>
        Data Subject
      </Text>
      <Text style={[styles.caption]}>
        Data Subject is any living individual who is the subject of Personal
        Data.
      </Text>
      <Text style={styles.title}>
        Personal Data
      </Text>
      <Text style={[styles.caption]}>
        Personal Data means data about a living individual who can be identified
        from those data (or from those and other information either in our
        possession or likely to come into our possession).
      </Text>
      <Text style={styles.title}>
        The User
      </Text>
      <Text style={[styles.caption]}>
        The User is the individual using our Service. The User corresponds to
        the Data Subject, who is the subject of Personal Data.
      </Text>
      <Text style={styles.title}>
        Usage Data
      </Text>
      <Text style={[styles.caption]}>
        The User is the individual using our Service. The User corresponds to
        the Data Subject, who is the subject of Personal Data.
      </Text>
      <Text style={styles.title}>
        Information Collection And Use
      </Text>
      <Text style={[styles.caption]}>
        We collect several different types of information for various purposes
        to provide and improve our Service to you. The types of data we collect
        are listed below.
      </Text>
      <Text style={styles.title}>
        Personal Data
      </Text>
      <Text style={[styles.caption]}>
        While using our Service, we may ask you to provide us with certain
        personally identifiable information that can be used to contact or
        identify you ("Personal Data"). Personally identifiable information may
        include, but is not limited to.
      </Text>
      <Text style={styles.title}>
        Email address
      </Text>
      <Text style={[styles.caption]}>
        First name and last name.
      </Text>
      <Text style={styles.title}>
        Usage Data
      </Text>
      <Text style={[styles.caption]}>
        We may also collect information how the Service is accessed and used
        ("Usage Data"). This Usage Data may include information such as your
        computer's Internet Protocol address (e.g. IP address), browser type,
        browser version, the pages of our Service that you visit, the time and
        date of your visit, the time spent on those pages, unique device
        identifiers and other diagnostic data.
      </Text>
      <Text style={styles.title}>
        Location Data
      </Text>
      <Text style={[styles.caption]}>
        We may use information about your location if you give us permission to
        do so (“Location Data”). We use this data to provide features of our
        Service, to improve and customize our Service. You can enable or disable
        location services when you use our Service at any time, through your
        device settings.
      </Text>
      <Text style={styles.title}>
        Data Retention
      </Text>
      <Text style={[styles.caption]}>
        We will retain your Personal Data only for as long as is necessary for
        the purposes set out in this Privacy Policy. We will retain and use your
        Personal Data to the extent necessary to comply with our legal
        obligations (for example, if we are required to retain your data to
        comply with applicable laws), resolve disputes, and enforce our legal
        agreements and policies.
      </Text>
      <Text style={styles.title}>
        Security
      </Text>
      <Text style={[styles.caption]}>
        The security of your data is important to us but remember that no method
        of transmission over the Internet or method of electronic storage is
        100% secure. While we strive to use commercially acceptable means to
        protect your Personal Data, we cannot guarantee its absolute security.
      </Text>
      <Text style={styles.title}>
        "Do Not Track" Signals
      </Text>
      <Text style={[styles.caption]}>
        We do not support Do Not Track ("DNT"). Do Not Track is a preference you
        can set in your web browser to inform websites that you do not want to
        be tracked. You can enable or disable Do Not Track by visiting the
        Preferences or Settings page of your web browser.
      </Text>
      <Text style={styles.title}>
        Your Rights
      </Text>
      <Text style={[styles.caption]}>
        Capiwise aims to take reasonable steps to allow you to correct, amend,
        delete, or limit the use of your Personal Data. Whenever made possible,
        you can update your Personal Data directly within your account settings
        section. If you are unable to change your Personal Data, please contact
        us to make the required changes.{"\n"}If you wish to be informed what
        Personal Data we hold about you and if you want it to be removed from
        our systems, please contact us.{"\n"}
        {"\n"}In certain circumstances, you have the right:{"\n"}
        {"\n"}
        &nbsp;&nbsp;• &nbsp;To access and receive a copy of the Personal Data we
        hold about you; {"\n"}
        &nbsp;&nbsp;• &nbsp;To rectify any Personal Data held about you that is
        inaccurate; {"\n"}
        &nbsp;&nbsp;• &nbsp;To request the deletion of Personal Data held about
        you. {"\n"}
        &nbsp;&nbsp;• &nbsp;You have the right to data portability for the
        information you provide to &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Capiwise.{" "}
        {"\n"}
        &nbsp;&nbsp;• &nbsp;You can request to obtain a copy of your Personal
        Data in a commonly &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;used electronic
        format so that you can manage and move it. {"\n"} {"\n"}
        Please note that we may ask you to verify your identity before
        responding to such requests.
      </Text>
      <Text style={styles.title}>
        Service Providers
      </Text>
      <Text style={[styles.caption]}>
        We may employ third-party companies and individuals to facilitate our
        Service ("Service Providers"), to provide the Service on our behalf, to
        perform Service-related services, or to assist us in analyzing how our
        Service is used. These third parties have access to your Personal Data
        only to perform these tasks on our behalf and are obligated not to
        disclose or use it for any other purpose.
      </Text>
      <Text style={styles.title}>
        Analytics
      </Text>
      <Text style={[styles.caption]}>
        We may use third-party Service Providers to monitor and analyze the use
        of our Service. These include but are not limited to:
      </Text>
      <Text style={styles.title}>
        Google Analytics
      </Text>
      <Text style={[styles.caption]}>
        Capiwise does not use remarketing services to advertise on third-party
        websites to you after you have visited our Service.
      </Text>
      <Text style={styles.title}>
        Payments
      </Text>
      <Text style={[styles.caption]}>
        We may provide paid products and/or services within the Service. In that
        case, we use third-party services for payment processing (e.g., payment
        processors). We will not store or collect your payment card details.
        That information is provided directly to our third-party payment
        processors whose use of your personal information is governed by their
        Privacy.
      </Text>
      <Text style={styles.title}>
        Links To Other Sites
      </Text>
      <Text style={[styles.caption]}>
        Capiwise may contain links to other websites that are not operated by
        us. If you click on a third-party link, you will be directed to that
        third-party's site. We strongly advise you to review the Privacy Policy
        of every site you visit. We have no control over and assume no
        responsibility for the content, privacy policies or practices of any
        third-party sites or services.
      </Text>

      <Text style={styles.title}>
        Children's Privacy
      </Text>
      <Text style={[styles.caption]}>
        Protecting the privacy of young children is especially important.
        Capiwise does not knowingly collect or maintain personally identifiable
        information from persons under 13 years of age ("Children"). No part of
        the Capiwise service is directed to persons under 13. If you are under
        13 years of age, then please do not use or access the Capiwise service
        at any time or in any manner. Any person who provides their personal
        information to Capiwise represents that they are 13 years of age or
        older. If Capiwise learns that personally identifiable information of
        persons less than 13 years of age has been collected without verifiable
        parental consent, then Capiwise will take the appropriate steps to
        delete this information from our servers.
      </Text>
      <Text style={styles.title}>
        Jurisdiction and Governing Law
      </Text>
      <Text style={[styles.caption]}>
        Your use of these Platforms and these Terms are governed by the law of
        Germany and you submit to the non-exclusive jurisdiction of the courts
        exercising jurisdiction in Germany.
      </Text>
      <Text style={styles.title}>
        European Union
      </Text>
      <Text style={[styles.caption]}>
        Capiwise is a data controller and processor for the purposes of the GDPR
        and by your consenting to this Privacy Policy, Capiwise is able to
        process your Personal Data in accordance with this Privacy Policy.
      </Text>
      <Text style={styles.title}>
        Changes To This Privacy Policy
      </Text>
      <Text style={[styles.caption]}>
        We may update our Privacy Policy from time to time. We will notify you
        of any changes by posting the new Privacy Policy on this page. We may
        let you know via email and/or a prominent notice on our Service, prior
        to the change becoming effective and update the "effective date" at the
        top of this Privacy Policy. You are advised to review this Privacy
        Policy periodically for any changes. Changes to this Privacy Policy are
        effective when they are posted on this page.
      </Text>
      <Text style={styles.title}>
        Feedback and Complaints
      </Text>
      <Text style={[styles.caption]}>
        If you have any complaints about our handling of your Personal
        Information, including any breaches by us of any applicable data privacy
        laws or any questions regarding this Privacy Policy, you can submit that
        complaint or query by contacting us using the methods detailed in the
        “Contact Us” paragraph below.{"\n"} {"\n"}Any complaints received by us
        will be referred to our compliance team for prompt investigation, and a
        written response will be provided to you as soon as possible.{"\n"}
        {"\n"}
        Should you not be satisfied with the resolution of any complaints made,
        you may seek further redress through the relevant data protection
        authority
      </Text>
      <Text style={styles.title}>
        Contact Us
      </Text>
      <Text style={[styles.caption]}>
        If you have any questions about this Privacy Policy, please contact us
        by email: privacy@capiwise.com or post Mittelheide 14, 12555 Berlin.
      </Text>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#040B11",
    paddingHorizontal: 15,
  },
  caption: {
    textAlign: "justify",
    fontSize: 10,
    fontWeight: "400",
    marginBottom: 20,
    color: "#FFF",
    width: "100%",
  },
  title: {
    textAlign: "justify",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#FFF",
    width: "100%",
  }
});
